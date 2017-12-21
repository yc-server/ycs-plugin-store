import { IModel, Model, Schema } from '@ycs/core/lib/db';
import { EAction } from '../order_wrap/utils';

const schema = new Schema(
  {
    orderWrap: {
      type: Schema.Types.ObjectId,
      ref: '__store_order_wrap',
    },
    action: {
      type: String,
      enum: [
        EAction.CustomerCreate,
        EAction.CustomerRefund,
        EAction.CustomerCancel,
        EAction.CustomerSign,
        EAction.CustomerComment,
        EAction.SupplierAccept,
        EAction.SupplierReject,
        EAction.SupplierComplete,
        EAction.SupplierRefundAccept,
        EAction.SupplierRefundReject,
        EAction.SystemRefundComplete,
        EAction.SystemError,
        EAction.SystemPay,
      ],
      required: true,
    },
    msg: String,
    extra: {},
  },
  { timestamps: {} }
);

export default Model({
  name: '__store_order_wrap_log',
  auth: false,
  schema,
});
