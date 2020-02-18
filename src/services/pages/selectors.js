import { createSelector } from 'reselect/lib/index';
import router from '../redux-router';

// export const map = (state, collection) => state.get('fireStore').data[collection] || {};

const userPagesMap = state => state.get('fireStore').data.pages || {};
const order = state => state.get('firebase').profile.pages || [];

const list = createSelector(userPagesMap, order, (pages, _order) => {
  return _order.reduce((accumulator, pageId) => {
    if (pages[pageId]) {
      accumulator.push(Object.assign({}, pages[pageId], { id: pageId }));
    }
    return accumulator;
  }, []);
});

const item = createSelector(userPagesMap, router.selectors.pageId, (_userCollectionsMap, pageId) => {
  return _userCollectionsMap[pageId];
});

export default {
  list,
  order,
  item,
};
