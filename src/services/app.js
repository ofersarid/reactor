import { fromJS } from 'immutable';

const HEADER_TITLE = 'APP/HEADER_TITLE';
const TOGGLE_DEV_MODE = 'APP/TOGGLE_DEV_MODE';
const TOGGLE_MENU = 'APP/TOGGLE_MENU';

const reducer = (state = fromJS({
  headerTitle: 'Reactor',
  devMode: false,
  menuIsOpen: false,
}), action) => {
  switch (action.type) {
    case HEADER_TITLE:
      return state.set('headerTitle', action.newTitle);
    case TOGGLE_DEV_MODE:
      return state.set('devMode', !state.get('devMode'));
    case TOGGLE_MENU:
      return state.set('menuIsOpen', !state.get('menuIsOpen'));
    case 'ROUTER:LOCATION_CHANGE':
      return state.set('menuIsOpen', false);
    default:
      return state;
  }
};

const selectors = {
  headerTitle: state => state.getIn(['app', 'headerTitle']),
  devMode: state => state.getIn(['app', 'devMode']),
  menuIsOpen: state => state.getIn(['app', 'menuIsOpen']),
};

const actions = {
  updateAppTitle: newTitle => ({
    type: HEADER_TITLE,
    newTitle,
  }),
  toggleDevMode: () => ({
    type: TOGGLE_DEV_MODE,
  }),
  toggleMenu: () => ({
    type: TOGGLE_MENU,
  }),
};

export default {
  reducer,
  actions,
  selectors,
};
