import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  listName: 'collections',
});

const home = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SELECT_LIST:
      return state.set('listName', action.list);
    default:
      return state;
  }
};

export default home;
