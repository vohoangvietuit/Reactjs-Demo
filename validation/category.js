const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCategoryInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.brand = !isEmpty(data.brand) ? data.brand : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (Validator.isEmpty(data.brand)) {
    errors.brand = 'Brand field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
