import { ACTIONS } from './constants';

const updateLocation = route => ({
  type: ACTIONS.LOCATION_CHANGE,
  route,
});

const setGoBackPath = path => ({
  type: ACTIONS.SET_GO_BACK_PATH,
  path,
});

export default {
  updateLocation,
  setGoBackPath,
};
