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

const collection = state => {
  const collections = state.get('fireStore').data.collections;
  const id = router.selectors.collectionId(state);
  if (collections && id) {
    return collections[id];
  }
};

const order = state => {
  const _collection = collection(state);
  if (_collection) {
    return _collection.order;
  }
};

const data = state => state.get('fireStore').data.assets || {};

const assets = createSelector(
  data,
  order,
  blackList.selectors.deletedAssets,
  (_data, _order, _blackList) => {
    if (_data && _order) {
      const orderedList = _order.split(' | ');
      return orderedList.reduce((accumulator, key) => {
        if (!_data[key] || _blackList.includes(key)) return accumulator; // object is empty (null)
        accumulator.push(Object.assign({}, _data[key], { id: key }));
        return accumulator;
      }, []);
    }
  });

export default {
  list,
  item,
  assets,
};
