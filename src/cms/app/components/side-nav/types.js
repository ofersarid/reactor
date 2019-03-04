import PropTypes from 'prop-types';

export const sideNav = {
  isMobile: PropTypes.bool.isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
};

export const collections = {
  userCollections: PropTypes.object,
  collectionId: PropTypes.string.isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
};
