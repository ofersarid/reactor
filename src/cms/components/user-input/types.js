import PropTypes from 'prop-types';

export const inputTypes = ['single-line', 'multi-line', 'multi-line-preserve-lines', 'post', 'image', 'select',
  'pdf', 'date-time', 'date', 'time', 'link', 'password', 'number', 'switch', 'email', 'youtube'];

export const userInput = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.any,
  onEnterKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
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
  required: PropTypes.bool,
  validationTip: PropTypes.string,
  autoFocus: PropTypes.bool,
  preserveLineBreaks: PropTypes.bool,
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
  required: PropTypes.bool,
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
  validationTip: PropTypes.string,
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
