import PropTypes from 'prop-types';

export const inputTypes = ['single-line', 'multi-line', 'post', 'image', 'select',
  'pdf', 'date-time', 'link', 'password', 'number', 'switch', 'email', 'youtube'];

export const userInput = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.any,
  onEnterKeyPress: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  onValidation: PropTypes.func,
  type: PropTypes.oneOf(inputTypes),
  mask: PropTypes.bool,
  disabled: PropTypes.bool,
  validateWith: PropTypes.func,
  onlyNumbers: PropTypes.bool,
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.string),
  rtl: PropTypes.bool,
  optional: PropTypes.bool,
  stretch: PropTypes.bool,
};

export const switchTypes = {
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};

export const richContent = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  min: PropTypes.number,
  onValidation: PropTypes.func.isRequired,
  validateWith: PropTypes.func,
  optional: PropTypes.bool,
};

export const pdfFile = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onValidation: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  validateWith: PropTypes.func,
};

export const imageFile = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onValidation: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  validateWith: PropTypes.func,
  transformer: PropTypes.func,
};

export const validationIndicator = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.any,
  onValidation: PropTypes.func.isRequired,
  show: PropTypes.bool,
  numeric: PropTypes.bool,
  validateWith: PropTypes.func,
  rtl: PropTypes.bool,
};

export const link = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onValidation: PropTypes.func.isRequired,
  onEnterKeyPress: PropTypes.func,
  transformer: PropTypes.func,
  validateWith: PropTypes.func,
  rtl: PropTypes.bool,
};
