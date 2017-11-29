import { IContext } from '@ycs/core/lib/context';
import { paginate, patchUpdates, show } from '@ycs/core/lib/db';
import { Boom, handleError } from '@ycs/core/lib/errors';
import { response } from '@ycs/core/lib/response';
import Model from './model';
import { IConfig } from '../config';
import OrderWrap from '../order_wrap/model';

export default class Controller {
  constructor(private config: IConfig) { }
  // Gets a list of Models
  public index = async (ctx: IContext) => {
    try {
      const paginateResult = await paginate(Model, ctx);
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
      delete ctx.request.fields._id;
      ctx.request.fields.__auth = ctx.request.auth._id;
      const entity = await Model.create(ctx.request.fields);
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

  // Gets logs by wrap
  public wrap = async (ctx: IContext) => {
    try {
      if (!await OrderWrap.count({
        _id: ctx.params.id,
        __auth: ctx.request.auth._id
      }).exec()) throw Boom.forbidden();
      const paginateResult = await paginate(Model, ctx, {
        orderWrap: ctx.params.id
      });
      response(ctx, 200, paginateResult);
    } catch (e) {
      handleError(ctx, e);
    }
  };
}
