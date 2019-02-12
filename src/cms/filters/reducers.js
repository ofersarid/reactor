import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  query: {},
  ignoreCase: true,
  orderBy: null,
});

const filter = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_QUERY:
      return state.set('query', fromJS(action.query));

    case ACTIONS.UPDATE_ORDER:
      return state.set('orderBy', fromJS(action.order));

    case ACTIONS.RESET_FILTER:
      return initialState;

    default:
      return state;
  }
};

export default filter;
