import { IModel, Model, Schema } from '@ycs/core/lib/db';

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  variable: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['number', 'text', 'textarea', 'image', 'images'],
  },
  required: {
    type: Boolean,
    default: false,
  },
});

export default Model({
  name: '__store_field',
  auth: true,
  schema,
});
