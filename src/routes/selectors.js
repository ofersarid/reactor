const pathname = state => state.getIn(['router', 'pathname']);
const collectionId = state => state.getIn(['router', 'params', 'collectionId']);
const pageId = state => state.getIn(['router', 'params', 'pageId']);
const prevPath = state => state.getIn(['router', 'prevPath']);
const goBackPath = state => state.getIn(['router', 'goBackPath']);
const assetId = state => state.getIn(['router', 'params', 'assetId']);

export default {
  pathname,
  prevPath,
  collectionId,
  pageId,
  goBackPath,
  assetId,
};
