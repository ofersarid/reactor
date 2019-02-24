import { ACTIONS } from './constants';

export const updateLocation = route => ({
  type: ACTIONS.LOCATION_CHANGE,
  route,
});
