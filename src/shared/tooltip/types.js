import PropTypes from 'prop-types';

export const tipAnimations = ['shift', 'fade', 'scale', 'perspective'];

export default {
  children: PropTypes.any,
  position: PropTypes.oneOf(['top', 'right', 'left', 'bottom']),
  content: PropTypes.node,
  className: PropTypes.string,
  interactive: PropTypes.bool,
  animation: PropTypes.oneOf(tipAnimations),
  store: PropTypes.any,
};
