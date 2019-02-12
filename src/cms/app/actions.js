import { ACTIONS } from './constants';

export const toggleSideNav = () => ({
  type: ACTIONS.TOGGLE_SIDE_NAV
});

export const toggleDeleteMode = () => ({
  type: ACTIONS.TOGGLE_DELETE_MODE
});

export const markForDelete = id => {
  return {
    type: ACTIONS.MARK_FOR_DELETE,
    id,
  };
};
