import { ACTIONS } from './constants';

export const updateLocation = location => ({
  type: ACTIONS.LOCATION_CHANGE,
  location,
});
