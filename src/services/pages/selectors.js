import { createSelector } from 'reselect/lib/index';
import router from '../redux-router';

// export const map = (state, collection) => state.get('fireStore').data[collection] || {};

const userPagesMap = state => state.get('fireStore').data.pages || {};

const list = createSelector(userPagesMap, (pages) => {
  return Object.keys(pages).reduce((accumulator, pageId) => {
    accumulator.push(Object.assign({}, pages[pageId], { id: pageId }));
    return accumulator;
  }, []);
});

const item = createSelector(userPagesMap, router.selectors.pageId, (_userCollectionsMap, pageId) => {
  return _userCollectionsMap[pageId];
});

export default {
  list,
  item,
};
