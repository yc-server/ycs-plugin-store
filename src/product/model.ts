import { IModel, Model, Schema } from '@ycs/core/lib/db';

const schema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: '__store_category',
      required: true,
    },
    field: {},
    filters: {},
  },
  {
    timestamps: {},
  }
);
export default Model({
  name: '__store_product',
  auth: true,
  schema,
});
