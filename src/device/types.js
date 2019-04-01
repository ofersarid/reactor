import PropTypes from 'prop-types';

export const deviceTypes = {
  deviceType: PropTypes.oneOf(['desktop', 'mobile', 'tablet']),
  deviceOrientation: PropTypes.oneOf(['landscape', 'portrait']),
  isMobile: PropTypes.bool,
};

const types = {
  storeOrientation: PropTypes.func.isRequired,
};

export default types;
