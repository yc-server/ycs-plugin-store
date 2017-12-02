import { IModel, Model, Schema } from '@ycs/core/lib/db';

export enum EStatus {
  Pending = 'pending',
  Paid = 'paid',
  Processing = 'processing',
  Unsigned = 'unsigned',
  Cancelled = 'cancelled',
  Completed = 'completed',
  Commented = 'commented',
}

export enum ERefund {
  None = 'none',
  Pending = 'pending',
  Rejected = 'rejected',
  Processing = 'processing',
  Completed = 'completed',
}

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
        EStatus.Pending,
        EStatus.Paid,
        EStatus.Processing,
        EStatus.Unsigned,
        EStatus.Cancelled,
        EStatus.Completed,
        EStatus.Commented,
      ],
      default: EStatus.Pending,
    },
    refund: {
      type: String,
      enum: [
        ERefund.None,
        ERefund.Pending,
        ERefund.Processing,
        ERefund.Completed,
        ERefund.Rejected,
      ],
      default: ERefund.None,
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
