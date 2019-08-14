import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  show: false,
});

const splashScreen = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_SPLASH:
      return state.set('show', true);

    case ACTIONS.HIDE_SPLASH:
      return state.set('show', false);

    default:
      return state;
  }
};

export default splashScreen;
