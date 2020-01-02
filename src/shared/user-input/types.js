import PropTypes from 'prop-types';

export const inputTypes = ['single-line', 'multi-line', 'multi-line-preserve-lines', 'rich', 'image', 'select',
  'pdf', 'date-time', 'date', 'time', 'link', 'password', 'number', 'switch', 'email', 'youtube', 'multi-select'];

export const inputTypesWithValidationFunction = ['single-line', 'multi-line', 'multi-line-preserve-lines', 'rich',
  'link', 'password', 'number', 'email', 'youtube'];

export const inputTypesWithOptions = ['select', 'multi-select', 'switch'];

export const inputTypesWithMinMaxChars = ['single-line', 'multi-line', 'multi-line-preserve-lines', 'rich'];

export const inputTypesWithArtPreview = ['image', 'pdf'];

export const validationFunctionTypes = ['min-max', 'date-time', 'link', 'email'];

export const userInput = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.any,
  onEnterKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
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
  options: PropTypes.array,
  rtl: PropTypes.bool,
  required: PropTypes.bool,
  validationTip: PropTypes.string,
  focus: PropTypes.bool,
  preserveLineBreaks: PropTypes.bool,
  _key: PropTypes.string,
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
  max: PropTypes.number,
  validateWith: PropTypes.func,
  required: PropTypes.bool,
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

export default {
  userInput,
};
