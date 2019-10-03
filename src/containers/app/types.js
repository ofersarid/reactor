import PropTypes from 'prop-types';

export const stage = {
  children: PropTypes.any,
};

export const pageList = {
  pathname: PropTypes.string.isRequired,
  isCMS: PropTypes.bool.isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
};

export const navBar = {
};

export const mainContainer = {
  children: PropTypes.any,
  isLoaded: PropTypes.bool.isRequired,
  isCMS: PropTypes.bool.isRequired,
  uid: PropTypes.string,
};

export const rightCol = {
  logOut: PropTypes.func.isRequired,
};
