const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProductInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.price = !isEmpty(data.price) ? data.price : 0;
  data.quantity = !isEmpty(data.quantity) ? data.quantity : 0;
  data.category = !isEmpty(data.category) ? data.category : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (data.price === 0) {
    errors.price = 'Price field is required';
  }
  if (data.quantity === 0) {
    errors.quantity = 'Quantity field is required';
  }
  if (Validator.isEmpty(data.category)) {
    errors.category = 'Category field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
