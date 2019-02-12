import { ACTIONS } from './constants';

export const storeOrientation = (orientation) => ({
  type: ACTIONS.STORE_ORIENTATION,
  orientation,
});
