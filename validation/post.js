const Validator = require('validator');
const isEmpty = require('./is-empty');
const isImageUrl = require('is-image-url');

module.exports = function validatePostInput(data) {
 let errors = {};

     data.text = !isEmpty(data.text) ? data.text : '';
     data.image = !isEmpty(data.image) ? data.image : '';

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 and 300 characters';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }

  if (!isImageUrl(data.image)) {
    errors.image = 'Image URL is invalid';
  }

    return {
    errors,
    isValid: isEmpty(errors)
  };
};

