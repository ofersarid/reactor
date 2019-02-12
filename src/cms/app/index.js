import * as types from './types';
import * as consts from './constants';
import * as selectors from './selectors';
import * as actions from './actions';

const App = {
  types,
  consts,
  selectors,
  actions,
};

export { default as MainContainer } from './components/main-container/main-container';
export default App;
