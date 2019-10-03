import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  deletedAssets: [],
});

const blacklist = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.STORE_DELETED_IDS_HACK:
      return state.set('blackList', state.get('deletedAssets').concat(action.ids));

    default:
      return state;
  }
};

export default blacklist;
