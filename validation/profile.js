const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.customURL = !isEmpty(data.customURL) ? data.customURL : '';

  if (!Validator.isLength(data.customURL, { min: 2, max: 40 })) {
    errors.customURL = 'customURL needs to between 2 and 40 characters';
  }

  if (Validator.isEmpty(data.customURL)) {
    errors.customURL = 'customURL is required';
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.phonenumber)) {
    if (!Validator.isNumeric(data.phonenumber)) {
      errors.phonenumber = 'You only can put numbers in this field';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
