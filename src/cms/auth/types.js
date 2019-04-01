import { deviceTypes } from '/src/device/types';
import PropTypes from 'prop-types';

export const login = {
  ...deviceTypes,
  logIn: PropTypes.func.isRequired,
  authError: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  working: PropTypes.bool.isRequired,
  uid: PropTypes.string,
};

export const form = {
  ...deviceTypes,
  password: PropTypes.string.isRequired,
};

export const authRedirect = {
  children: PropTypes.any,
  uid: PropTypes.string,
  pathname: PropTypes.string.isRequired,
};
