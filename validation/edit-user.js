const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateUserInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  // data.location = !isEmpty(data.location) ? data.location : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  // if (!Validator.isLength(data.location, { min: 5, max: 200 })) {
  //   errors.location = 'Location must be between 5 and 200 characters';
  // }
  // if (Validator.isEmpty(data.location)) {
  //   errors.location = 'Location field is required';
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
