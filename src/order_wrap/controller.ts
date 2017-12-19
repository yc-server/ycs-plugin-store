import { IContext } from '@ycs/core/lib/context';
import { paginate, patchUpdates, show } from '@ycs/core/lib/db';
import { Boom, handleError } from '@ycs/core/lib/errors';
import { response } from '@ycs/core/lib/response';
import Model from './model';
import ProductModel from '../product/model';
import OrderModel from '../order/model';
import { IConfig } from '../config';
import * as utils from './utils';

function isSub(arr: any[], sub: any[]) {
  for (const x of sub) if (!arr.includes(x)) return false;
  return true;
}

export default class Controller {
  constructor(private config: IConfig) { }
  // Gets a list of Models
  public index = async (ctx: IContext) => {
    try {
      let filter = {
        __auth: ctx.request.auth._id,
      };
      if (isSub(ctx.request.auth.roles, this.config.roles)) filter = null;
      const paginateResult = await paginate(Model, ctx, filter);
      response(ctx, 200, paginateResult);
    } catch (e) {
      handleError(ctx, e);
    }
  };

  // Gets a single Model from the DB
  public show = async (ctx: IContext) => {
    try {
      const entity = await show(Model, ctx);
      if (!entity) throw Boom.notFound();
      ctx.status = 200;
      ctx.body = entity.toJSON({
        virtuals: true,
      });
    } catch (e) {
      handleError(ctx, e);
    }
  };

  // Creates a new Model in the DB
  public create = async (ctx: IContext) => {
    try {
      if (!ctx.request.fields) throw Boom.badData(this.config.errors.empty);
      if (!ctx.request.fields.products)
        throw Boom.badData(this.config.errors.productNotFound);
      const products: any[] = [];
      for (const id of ctx.request.fields.products) {
        const product = await ProductModel.findById(id).exec();
        if (!product) throw Boom.badData(this.config.errors.productNotFound);
        products.push(product);
      }
      const orders: any[] = [];
      for (const product of products) {
        const price = this.config.orderPrice(product);
        const order = await OrderModel.create({
          product: product._id,
          price: price,
          __auth: ctx.request.auth._id,
        });
        orders.push(order);
      }
      const entity = await Model.create({
        orders: orders.map(x => x._id),
        price: orders.map(x => x.price).reduce((a, b) => a + b, 0),
        __auth: ctx.request.auth._id,
      });
      await utils.act(entity, utils.EAction.CustomerCreate);
      response(ctx, 201, entity);
    } catch (e) {
      handleError(ctx, e);
    }
  };

  // Updates an existing Model in the DB
  public update = async (ctx: IContext) => {
    try {
      delete ctx.request.fields._id;
      const entity = await Model.findById(ctx.params.id).exec();
      if (!entity) throw Boom.notFound();
      patchUpdates(entity, ctx.request.fields);
      await entity.save();
      response(ctx, 200, entity);
    } catch (e) {
      handleError(ctx, e);
    }
  };

  // Actions
  public action = async (ctx: IContext) => {
    const entity: any = await Model.findById(ctx.params.id).exec();
    if (!entity) throw Boom.notFound();
    const action: utils.EAction = ctx.request.fields.action;
    try {
      if (action.startsWith('customer')) {
        if (!entity.__auth.equals(ctx.request.auth._id))
          throw Boom.forbidden('No manager permision');
      } else {
        if (!isSub(ctx.request.auth.roles, this.config.roles))
          throw Boom.forbidden('No manager permision');
      }
      await utils.act(entity, action, ctx.request.fields.msg, ctx.request.fields.extra);
      response(ctx, 200, entity);
    } catch (e) {
      handleError(ctx, e);
    }
  };

  // Deletes a Model from the DB
  public destroy = async (ctx: IContext) => {
    try {
      const entity = await Model.findById(ctx.params.id).exec();
      if (!entity) throw Boom.notFound();
      await entity.remove();
      response(ctx, 204);
    } catch (e) {
      handleError(ctx, e);
    }
  };
}
