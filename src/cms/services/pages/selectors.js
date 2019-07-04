import { createSelector } from 'reselect';
import _sortBy from 'lodash/sortBy';
import Routes from '/src/routes';
import { userCollectionsMap } from '../collections/selectors';

// export const map = (state, collection) => state.get('fireStore').data[collection] || {};

const userPagesMap = state => state.get('fireStore').data.pages || {};

const list = createSelector(userPagesMap, (pages) => {
  return _sortBy(Object.keys(pages).reduce((accumulator, pageId) => {
    accumulator.push(Object.assign({}, pages[pageId], { id: pageId }));
    return accumulator;
  }, []), item => item.name ? item.name.toLowerCase() : null, ['asc']);
});

const item = createSelector(userCollectionsMap, (_userCollectionsMap) => {
  return _userCollectionsMap[Routes.selectors.pageId];
});

export default {
  list,
  item,
};
