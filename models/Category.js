const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  }
  // products: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'product'
  //   }
  // ]
});

module.exports = Category = mongoose.model('category', CategorySchema);
