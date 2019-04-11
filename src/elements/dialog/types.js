import PropTypes from 'prop-types';
import { deviceTypes } from '/src/device/types';
import { button } from '/src/elements/button/types';

const types = {
  ...deviceTypes,
  header: PropTypes.any.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    closeDialog: PropTypes.bool,
    triggerOnEnter: PropTypes.bool,
    ...button
  })),
  children: PropTypes.any,
  bodyClass: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  errorMsg: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default types;
