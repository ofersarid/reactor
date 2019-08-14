import { fromJS } from 'immutable';
import { ACTIONS } from './constants';
// import Routes from '/src/routes';

const initialState = fromJS({
  headerTitle: 'Reactor',
});

const app = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.HEADER_TITLE:
      return state.set('headerTitle', action.newTitle);

    default:
      return state;
  }
};

export default app;
