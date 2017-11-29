import Log from '../order_wrap_log/model';
import { act as subAct } from '../order/utils';
import Order from '../order/model';

export async function act(
  entity: any,
  action: string,
  msg?: string,
  extra?: any
) {
  await Log.create({
    orderWrap: entity._id,
    action: action,
    msg: msg,
    extra: extra,
  });
  for(const order of entity.orders) {
    const o = await Order.findById(order).exec();
    await subAct(o, action, msg, extra);
  }
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
