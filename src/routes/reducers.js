import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  hash: '',
  pathname: '',
  search: '',
  state: '',
});

const routes = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOCATION_CHANGE:
      return fromJS(action.location);

    default:
      return state;
  }
};

export default routes;
