import PropTypes from 'prop-types';

export const sideNav = {
  isMobile: PropTypes.bool.isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
};

export const collections = {
  userCollections: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string.required,
    icon: PropTypes.string,
  })),
  collectionId: PropTypes.string.isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
};
