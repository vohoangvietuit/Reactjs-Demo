const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateOrderInput(data) {
  let errors = {};

  data.price = !isEmpty(data.price) ? data.price : 0;
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.order_detail = !isEmpty(data.order_detail) ? data.order_detail : '';

  // if (data.price === 0) {
  //   errors.price = 'Price field is required';
  // }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Phone field is required';
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = 'Address field is required';
  }

  // if (Validator.isEmpty(data.order_detail)) {
  //   errors.order = 'Must be have item to be checkout';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
