import { deviceTypes } from '/src/device/types';
import PropTypes from 'prop-types';

export const stage = {
  ...deviceTypes,
  children: PropTypes.any,
};

export const pageList = {
  ...deviceTypes,
  pathname: PropTypes.string.isRequired,
  isCMS: PropTypes.bool.isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
};

export const navBar = {
  ...deviceTypes,
};

export const mainContainer = {
  ...deviceTypes,
  children: PropTypes.any,
  isLoaded: PropTypes.bool.isRequired,
  isCMS: PropTypes.bool.isRequired,
  uid: PropTypes.string,
};

export const rightCol = {
  ...deviceTypes,
  logOut: PropTypes.func.isRequired,
};
