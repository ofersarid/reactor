import PropTypes from 'prop-types';

export const reduxRoutes = {
  location: PropTypes.shape({
    hash: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    state: PropTypes.object,
  }).isRequired,
  update: PropTypes.func.isRequired,
  children: PropTypes.any,
};
