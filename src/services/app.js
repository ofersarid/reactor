import { fromJS } from 'immutable';

const HEADER_TITLE = 'APP/HEADER_TITLE';
const TOGGLE_DEV_MODE = 'APP/TOGGLE_DEV_MODE';

const reducer = (state = fromJS({
  headerTitle: 'Reactor',
  devMode: true,
}), action) => {
  switch (action.type) {
    case HEADER_TITLE:
      return state.set('headerTitle', action.newTitle);
    case TOGGLE_DEV_MODE:
      return state.set('devMode', !state.get('devMode'));

    default:
      return state;
  }
};

const selectors = {
  headerTitle: state => state.getIn(['app', 'headerTitle']),
  devMode: state => state.getIn(['app', 'devMode']),
};

const actions = {
  updateAppTitle: newTitle => ({
    type: HEADER_TITLE,
    newTitle,
  }),
};

export default {
  reducer,
  actions,
  selectors,
};
