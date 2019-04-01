import PropTypes from 'prop-types';

export const popover = {
  children: PropTypes.any,
  position: PropTypes.oneOf(['top', 'right', 'left', 'bottom']),
  content: PropTypes.node,
  dropMenu: PropTypes.bool,
};

export const content = {
  children: PropTypes.any,
  handleClickOutside: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
