import PropTypes from 'prop-types';
import { deviceTypes } from '/src/cms/device/types';

const types = {
  ...deviceTypes,
  show: PropTypes.bool.isRequired,
  children: PropTypes.any,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['error', 'warning', 'success']).isRequired,
  className: PropTypes.string,
};

export default types;
