// export const sideNavOpen = state => state.getIn(['app', 'sideNavOpen']);
// export const deleteMode = state => state.getIn(['app', 'deleteMode']);
// export const markedForDelete = state => state.getIn(['app', 'markedForDelete']);
const deletedAssets = state => state.getIn(['blacklist', 'deletedAssets']);

export default {
  deletedAssets,
};
