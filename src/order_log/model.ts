import { IModel, Model, Schema } from '@ycs/core/lib/db';

const schema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: '__store_order',
    },
    action: {
      type: String,
      enum: [
        'customer-create',
        'customer-refund',
        'customer-cancel',
        'customer-sign',
        'customer-comment',
        'supplier-accept',
        'supplier-reject',
        'supplier-complete',
        'supplier-refund-accept',
        'supplier-refund-reject',
        'system-refund-complete',
        'system-error',
        'system-pay',
      ],
      required: true,
    },
    msg: String,
    extra: {},
  },
  { timestamps: {} }
);

export default Model({
  name: '__store_order_log',
  auth: false,
  schema,
});
