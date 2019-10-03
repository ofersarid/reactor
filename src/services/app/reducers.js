import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  headerTitle: 'Reactor',
  devMode: false,
});

const app = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.HEADER_TITLE:
      return state.set('headerTitle', action.newTitle);
    case ACTIONS.TOGGLE_DEV_MODE:
      return state.set('devMode', !state.get('devMode'));

    default:
      return state;
  }
};

export default app;
