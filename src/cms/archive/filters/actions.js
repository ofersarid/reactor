import { ACTIONS } from './constants';

export const updateQuery = query => ({
  type: ACTIONS.UPDATE_QUERY,
  query,
});

export const updateOrder = order => ({
  type: ACTIONS.UPDATE_ORDER,
  order,
});

export const resetFilter = {
  type: ACTIONS.RESET_FILTER,
};
