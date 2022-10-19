const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateChangePassInput(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : '';
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : '';
  data.newPassword2 = !isEmpty(data.newPassword2) ? data.newPassword2 : '';

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (Validator.equals(data.password, data.newPassword)) {
    errors.newPassword = 'New password must not match current password';
  }

  if (Validator.isEmpty(data.newPassword)) {
    errors.newPassword = 'New Password field is required';
  }
  if (!Validator.isLength(data.newPassword, { min: 6, max: 30 })) {
    errors.newPassword = 'New Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.newPassword2)) {
    errors.newPassword2 = 'Confirm Password field is required';
  }

  if (!Validator.equals(data.newPassword, data.newPassword2)) {
    errors.newPassword2 = 'Must match new password';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
