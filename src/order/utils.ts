import Log from '../order_log/model';

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
    case 'customer-create':
      return;
    case 'customer-refund':
      entity.refund = 'pending';
      await entity.save();
      return;
    case 'customer-cancel':
      entity.status = 'cancelled';
      await entity.save();
      return;
    case 'customer-sign':
      entity.status = 'completed';
      await entity.save();
      return;
    case 'customer-comment':
      // TODO
      entity.status = 'commented';
      await entity.save();
      return;
    case 'supplier-accept':
      entity.status = 'processing';
      await entity.save();
      return;
    case 'supplier-reject':
      entity.status = 'cancelled';
      await entity.save();
      return;
    case 'supplier-complete':
      entity.status = 'completed';
      await entity.save();
      return;
    case 'supplier-refund-accept':
      entity.refund = 'processing';
      await entity.save();
      return;
    case 'supplier-refund-reject':
      entity.refund = 'rejected';
      await entity.save();
      return;
    case 'supplier-refund-complete':
      entity.refund = 'completed';
      await entity.save();
      return;
    case 'system-error':
      return;
    case 'system-pay':
      entity.status = 'paid';
      entity.paidBy = extra.paidBy;
      await entity.save();
      return;
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
  SupplierRefundComplete = 'supplier-refund-complete',
  SystemError = 'system-error',
  SystemPay = 'system-pay',
} 
