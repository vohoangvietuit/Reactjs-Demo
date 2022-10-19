const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
    uppercase: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  email: {
    type: String,
    required: true
  },
  order_detail: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'product'
      },
      product_name: {
        type: String
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number
      }
    }
  ],
  price: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  note: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Order = mongoose.model('order', OrderSchema);
