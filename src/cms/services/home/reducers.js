import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  list: 'collections',
});

const home = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SELECT_LIST:
      return state.set('list', action.list);
    default:
      return state;
  }
};

export default home;
