const headerTitle = state => state.getIn(['app', 'headerTitle']);
const devMode = state => state.getIn(['app', 'devMode']);

export default {
  headerTitle,
  devMode,
};
