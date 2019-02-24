import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  hash: '',
  pathname: '',
  params: {},
  search: '',
  state: '',
});

const routes = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOCATION_CHANGE:
      return fromJS(action.route);

    default:
      return state;
  }
};

export default routes;
