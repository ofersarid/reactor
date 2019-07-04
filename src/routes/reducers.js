import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  hash: '',
  pathname: '',
  prevPath: '',
  goBackPath: '/cms/home',
  params: {},
  search: '',
  state: '',
});

const routes = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOCATION_CHANGE:
      return state.merge(fromJS(action.route));

    case ACTIONS.SET_GO_BACK_PATH:
      return state.set('goBackPath', action.path);

    default:
      return state;
  }
};

export default routes;
