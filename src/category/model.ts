import { IModel, Model, Schema } from '@ycs/core/lib/db';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    fields: [
      {
        type: Schema.Types.ObjectId,
        ref: '__store_field',
      },
    ],
    filters: [
      {
        type: Schema.Types.ObjectId,
        ref: '__store_filter',
      },
    ],
  },
  {
    timestamps: {},
  }
);

export default Model({
  name: '__store_category',
  auth: true,
  schema,
});
