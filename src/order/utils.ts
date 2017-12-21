import Log from '../order_log/model';
import { Boom } from '@ycs/core/lib/errors';
import { ERefund, EStatus } from './model';
import { EventEmitter } from 'events';

export const event = new EventEmitter();
event.setMaxListeners(0);

export async function act(
  entity: any,
  action: EAction,
  msg?: string,
  extra?: any
) {
  await Log.create({
    order: entity._id,
    action: action,
    msg: msg,
    extra: extra,
  });
  switch (action) {
    case EAction.CustomerCreate:
      event.emit(EAction.CustomerCreate, entity, action, msg, extra);
      break;
    case EAction.CustomerRefund:
      if ([EStatus.Pending, EStatus.Cancelled].includes(entity.status))
        throw Boom.badData('Current status is not allowed to refund');
      if (entity.refund !== ERefund.None)
        throw Boom.badData('The refund is already in process');
      entity.refund = ERefund.Pending;
      await entity.save();
      event.emit(EAction.CustomerRefund, entity, action, msg, extra);
      break;
    case EAction.CustomerCancel:
      if (entity.status !== EStatus.Pending)
        throw Boom.badData('Current status is not allowed to cancel');
      entity.status = EStatus.Cancelled;
      await entity.save();
      event.emit(EAction.CustomerCancel, entity, action, msg, extra);
      break;
    case EAction.CustomerSign:
      if (entity.status !== EStatus.Unsigned)
        throw Boom.badData('Current status is not allowed to sign');
      entity.status = EStatus.Completed;
      await entity.save();
      event.emit(EAction.CustomerSign, entity, action, msg, extra);
      break;
    case EAction.CustomerComment:
      if (entity.status !== EStatus.Completed)
        throw Boom.badData('Current status is not allowed to comment');
      // TODO
      entity.status = EStatus.Commented;
      await entity.save();
      event.emit(EAction.CustomerComment, entity, action, msg, extra);
      break;
    case EAction.SupplierAccept:
      if (entity.status !== EStatus.Paid)
        throw Boom.badData('Current status is not allowed to accept');
      entity.status = EStatus.Processing;
      await entity.save();
      event.emit(EAction.SupplierAccept, entity, action, msg, extra);
      break;
    case EAction.SupplierReject:
      if (entity.status !== EStatus.Paid)
        throw Boom.badData('Current status is not allowed to reject');
      entity.status = EStatus.Cancelled;
      await entity.save();
      event.emit(EAction.SupplierReject, entity, action, msg, extra);
      break;
    case EAction.SupplierComplete:
      if (entity.status !== EStatus.Processing)
        throw Boom.badData('Current status is not allowed to complete');
      entity.status = EStatus.Unsigned;
      await entity.save();
      event.emit(EAction.SupplierComplete, entity, action, msg, extra);
      break;
    case EAction.SupplierRefundAccept:
      if (entity.refund !== ERefund.Pending)
        throw Boom.badData('Current refund status is not allowed to accept');
      entity.refund = ERefund.Processing;
      await entity.save();
      event.emit(EAction.SupplierRefundAccept, entity, action, msg, extra);
      break;
    case EAction.SupplierRefundReject:
      if (entity.refund !== ERefund.Pending)
        throw Boom.badData('Current refund status is not allowed to reject');
      entity.refund = ERefund.Rejected;
      await entity.save();
      event.emit(EAction.SupplierRefundReject, entity, action, msg, extra);
      break;
    case EAction.SystemRefundComplete:
      if (entity.refund !== ERefund.Processing)
        throw Boom.badData('Current refund status is not allowed to complete');
      entity.refund = ERefund.Completed;
      await entity.save();
      event.emit(EAction.SystemRefundComplete, entity, action, msg, extra);
      break;
    case EAction.SystemError:
      event.emit(EAction.SystemError, entity, action, msg, extra);
      break;
    case EAction.SystemPay:
      if (entity.status !== EStatus.Pending)
        throw Boom.badData('Current status is not allowed to pay');
      entity.status = EStatus.Paid;
      entity.paidBy = extra.paidBy;
      entity.chargeId = extra.chargeId;
      await entity.save();
      event.emit(EAction.SystemPay, entity, action, msg, extra);
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
