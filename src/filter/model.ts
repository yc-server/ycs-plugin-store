import { IModel, Model, Schema } from '@ycs/core/lib/db';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['enum', 'number']
    },
    enum: [String]
  }
);

export default Model({
  name: '__store_filter',
  auth: true,
  schema,
});

