import { fromJS } from 'immutable';
import { ACTIONS } from './constants';
// import Routes from '/src/routes';

const initialState = fromJS({
  headerTitle: 'Reactor',
  devMode: true,
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
