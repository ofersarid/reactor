import { createSelector } from 'reselect/lib/index';
import router from '../redux-router';
import blackList from '../blacklist';
import _sortBy from 'lodash/sortBy';

export const userCollectionsMap = state => state.get('fireStore').data.collections || {};

const list = createSelector(userCollectionsMap, (list) => {
  return _sortBy(Object.keys(list).reduce((accumulator, collectionId) => {
    accumulator.push(Object.assign({}, list[collectionId], { id: collectionId }));
    return accumulator;
  }, []), item => item.name ? item.name.toLowerCase() : null, ['asc']);
});

const item = createSelector(router.selectors.collectionId, userCollectionsMap, (_collectionId, _userCollectionsMap) => {
  return _userCollectionsMap[_collectionId];
});

const assets = createSelector(
  userCollectionsMap,
  router.selectors.collectionId,
  blackList.selectors.deletedAssets,
  (_userCollectionsMap, _collectionId, _blackList) => {
    if (_userCollectionsMap && _userCollectionsMap[_collectionId] && _userCollectionsMap[_collectionId].data) {
      const data = _userCollectionsMap[_collectionId].data;
      const orderedList = _userCollectionsMap[_collectionId].order.split(' | ');
      return orderedList.reduce((accumulator, key) => {
        if (!data[key] || _blackList.includes(key)) return accumulator; // object is empty (null)
        accumulator.push(Object.assign({}, data[key], { id: key }));
        return accumulator;
      }, []);
    }
  });

export default {
  list,
  item,
  assets,
};
