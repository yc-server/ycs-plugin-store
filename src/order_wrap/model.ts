import { IModel, Model, Schema } from '@ycs/core/lib/db';

const schema = new Schema(
  {
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: '__store_order',
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'paid',
        'processing',
        'cancelled',
        'completed',
        'commented',
      ],
      default: 'pending',
    },
    refund: {
      type: String,
      enum: ['none', 'pending', 'rejected', 'processing', 'completed'],
      default: 'none',
    },
    paidBy: String,
    extra: {},
  },
  { timestamps: {} }
);

export default Model({
  name: '__store_order_wrap',
  auth: true,
  schema,
});
