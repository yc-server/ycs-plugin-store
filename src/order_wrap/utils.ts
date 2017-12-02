import Log from '../order_wrap_log/model';
import { act as subAct } from '../order/utils';
import Order from '../order/model';
import { Boom } from '@ycs/core/lib/errors';
import { ERefund, EStatus } from './model';

export async function act(
  entity: any,
  action: EAction,
  msg?: string,
  extra?: any
) {
  await Log.create({
    orderWrap: entity._id,
    action: action,
    msg: msg,
    extra: extra,
  });
  for (const order of entity.orders) {
    const o = await Order.findById(order).exec();
    await subAct(o, action, msg, extra);
  }
  switch (action) {
    case EAction.CustomerCreate:
      break;
    case EAction.CustomerRefund:
      if ([EStatus.Pending, EStatus.Cancelled].includes(entity.status))
        throw Boom.badData('Current status is not allowed to refund');
      if (entity.refund !== ERefund.None)
        throw Boom.badData('The refund is already in process');
      entity.refund = ERefund.Pending;
      await entity.save();
      break;
    case EAction.CustomerCancel:
      if (entity.status !== EStatus.Pending)
        throw Boom.badData('Current status is not allowed to cancel');
      entity.status = EStatus.Cancelled;
      await entity.save();
      break;
    case EAction.CustomerSign:
      if (entity.status !== EStatus.Unsigned)
        throw Boom.badData('Current status is not allowed to sign');
      entity.status = EStatus.Completed;
      await entity.save();
      break;
    case EAction.CustomerComment:
      if (entity.status !== EStatus.Completed)
        throw Boom.badData('Current status is not allowed to comment');
      // TODO
      entity.status = EStatus.Commented;
      await entity.save();
      break;
    case EAction.SupplierAccept:
      if (entity.status !== EStatus.Paid)
        throw Boom.badData('Current status is not allowed to accept');
      entity.status = EStatus.Processing;
      await entity.save();
      break;
    case EAction.SupplierReject:
      if (entity.status !== EStatus.Paid)
        throw Boom.badData('Current status is not allowed to reject');
      entity.status = EStatus.Cancelled;
      await entity.save();
      break;
    case EAction.SupplierComplete:
      if (entity.status !== EStatus.Processing)
        throw Boom.badData('Current status is not allowed to complete');
      entity.status = EStatus.Unsigned;
      await entity.save();
      break;
    case EAction.SupplierRefundAccept:
      if (entity.refund !== ERefund.Pending)
        throw Boom.badData('Current refund status is not allowed to accept');
      entity.refund = ERefund.Processing;
      await entity.save();
      break;
    case EAction.SupplierRefundReject:
      if (entity.refund !== ERefund.Pending)
        throw Boom.badData('Current refund status is not allowed to reject');
      entity.refund = ERefund.Rejected;
      await entity.save();
      break;
    case EAction.SystemRefundComplete:
      if (entity.refund !== ERefund.Processing)
        throw Boom.badData('Current refund status is not allowed to complete');
      entity.refund = ERefund.Completed;
      await entity.save();
      break;
    case EAction.SystemError:
      break;
    case EAction.SystemPay:
      if (entity.status !== EStatus.Pending)
        throw Boom.badData('Current status is not allowed to pay');
      entity.status = EStatus.Paid;
      entity.paidBy = extra.paidBy;
      await entity.save();
      break;
    default:
      throw Boom.badData('Unkown Action:' + action);
  }
}

export enum EAction {
  CustomerCreate = 'customer-create',
  CustomerRefund = 'customer-refund',
  CustomerCancel = 'customer-cancel',
  CustomerSign = 'customer-sign',
  CustomerComment = 'customer-comment',
  SupplierAccept = 'supplier-accept',
  SupplierReject = 'supplier-reject',
  SupplierComplete = 'supplier-complete',
  SupplierRefundAccept = 'supplier-refund-accept',
  SupplierRefundReject = 'supplier-refund-reject',
  SystemRefundComplete = 'system-refund-complete',
  SystemError = 'system-error',
  SystemPay = 'system-pay',
}
