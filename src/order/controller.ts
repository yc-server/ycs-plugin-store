import { IContext } from '@ycs/core/lib/context';
import { paginate, patchUpdates, show } from '@ycs/core/lib/db';
import { Boom, handleError } from '@ycs/core/lib/errors';
import { response } from '@ycs/core/lib/response';
import Model from './model';
import ProductModel from '../product/model';
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
      if (!ctx.request.fields.product)
        throw Boom.badData(this.config.errors.productNotFound);
      delete ctx.request.fields._id;
      delete ctx.request.fields.logs;
      delete ctx.request.fields.status;
      delete ctx.request.fields.refund;
      delete ctx.request.fields.paidBy;
      ctx.request.fields.__auth = ctx.request.auth._id;
      const product = await ProductModel.findById(
        ctx.request.fields.product
      ).exec();
      if (!product) throw Boom.badData(this.config.errors.productNotFound);
      ctx.request.fields.price = this.config.orderPrice(product);
      const entity = await Model.create(ctx.request.fields);
      await utils.act(entity, 'customer-create');
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
    const action: string = ctx.request.fields.action;
    try {
      if (!action.startsWith('customer') && !isSub(ctx.request.auth.roles, this.config.roles))
        throw Boom.forbidden();
      await utils.act(entity, action);
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
