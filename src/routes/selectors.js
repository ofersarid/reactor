import { createSelector } from 'reselect';

export const pathname = state => state.getIn(['router', 'pathname']);

export const isCMS = createSelector(pathname, _pathName => {
  const isIt = Boolean(_pathName.match(/cms/));
  return isIt;
});

export const isAdd = createSelector(pathname, _pathName => Boolean(_pathName.match(/\/add$/)));

export const collectionId = state => state.getIn(['router', 'params', 'collectionId']);
