import { createSelector } from 'reselect';
// import { collectionId, entityId } from '/src/routes/selectors';
import { collectionId } from '/src/routes/selectors';
// import { query, ignoreCase, orderBy } from '/src/cms/filters/selectors';
import blackList from '../blacklist';
import _sortBy from 'lodash/sortBy';

// export const map = (state, collection) => state.get('fireStore').data[collection] || {};

export const userCollectionsMap = state => state.get('fireStore').data.collections || {};

const list = createSelector(userCollectionsMap, (list) => {
  return _sortBy(Object.keys(list).reduce((accumulator, collectionId) => {
    accumulator.push(Object.assign({}, list[collectionId], { id: collectionId }));
    return accumulator;
  }, []), item => item.name ? item.name.toLowerCase() : null, ['asc']);
});

const item = createSelector(collectionId, userCollectionsMap, (_collectionId, _userCollectionsMap) => {
  return _userCollectionsMap[_collectionId];
});

const assets = createSelector(
  userCollectionsMap,
  collectionId,
  blackList.selectors.deletedAssets,
  (_userCollectionsMap, _collectionId, _blackList) => {
    if (_userCollectionsMap && _userCollectionsMap[_collectionId] && _userCollectionsMap[_collectionId].data) {
      const data = _userCollectionsMap[_collectionId].data;
      return Object.keys(data).reduce((accumulator, key) => {
        if (!data[key] || _blackList.includes(key)) return accumulator; // object is empty (null)
        accumulator.push(Object.assign({}, data[key], { id: key }));
        return accumulator;
      }, []);
    }
  });

// const filteredData = createSelector(collectionData, query, ignoreCase, (_data, _query, _ignoreCase) => {
//   return _data.filter(itm => {
//     let match = true;
//     _query.keySeq().toArray().forEach(key => {
//       if (_ignoreCase && !itm[key].toString().toLowerCase().match(_query.get(key).toString().toLowerCase())) {
//         match = false;
//       } else if (!_ignoreCase && !itm[key].match(_query.get(key))) {
//         match = false;
//       }
//     });
//     return match;
//   });
// });
//
// export const filteredOrderedList = createSelector(filteredData, orderBy, (_data, _orderBy) => {
//   if (!_orderBy) {
//     return _data;
//   } else if (_orderBy === 'dateTime') {
//     return _sortBy(_data, itm => itm[_orderBy].toDate(), 'desc');
//   }
//   return _sortBy(_data, itm => itm[_orderBy], 'asc');
// });
//
// export const entity = createSelector(collection, entityId, (_collection, _entityId) => {
//   return _collection.data ? _collection.data[_entityId] : null;
// });
//
// export const getSortOptions = createSelector(
//   collection,
//   (_collection) => {
//     if (!_collection.fields) return [];
//     return _collection.fields.reduce((accumulator, field) => {
//       accumulator.push({
//         value: field.key,
//         label: field.label,
//       });
//       return accumulator;
//     }, []);
//   });

export default {
  list,
  item,
  assets,
};
