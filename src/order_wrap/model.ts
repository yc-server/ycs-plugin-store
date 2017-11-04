import { IModel, Model, Schema } from '@ycs/core/lib/db';

const schema = new Schema(
  {
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: '__store_order',
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: {} }
);

export default Model({
  name: '__store_order_wrap',
  auth: true,
  schema,
});
