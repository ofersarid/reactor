import { createSelector } from 'reselect';
import { collectionId, entityId } from '/src/routes/selectors';
import { query, ignoreCase, orderBy } from '/src/cms/filters/selectors';
import sort from 'lodash/orderBy';

// const list = (state, collection) => state.get('fireStore').ordered[collection] || [];
//
// const filteredList = createSelector(list, query, ignoreCase, (_list, _query, _ignoreCase) => {
//   return _list.filter(itm => {
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
// export const filteredOrderedList = createSelector(filteredList, orderBy, (_list, _orderBy) => {
//   if (_list[0] && _list[0][_orderBy]) {
//     if (_orderBy === 'dateTime') {
//       return sort(_list, itm => itm[_orderBy].toDate(), 'desc');
//     }
//     return sort(_list, itm => itm[_orderBy], 'asc');
//   }
//   return _list;
// });

export const map = (state, collection) => state.get('fireStore').data[collection] || {};

export const entityById = (id, collection, state) => map(state, collection)[id];

export const settings = state => state.get('fireStore').data.settings || {};

/* NEW SELECTORS FOR SAAS */

export const userCollectionsMap = state => state.get('fireStore').data.collections || {};

export const collection = createSelector(collectionId, userCollectionsMap, (_collectionId, _userCollectionsMap) => {
  return _userCollectionsMap[_collectionId];
});

const collectionData = createSelector(userCollectionsMap, collectionId, (_userCollectionsMap, _collectionId) => {
  if (_userCollectionsMap && _userCollectionsMap[_collectionId] && _userCollectionsMap[_collectionId].data) {
    const data = _userCollectionsMap[_collectionId].data;
    return Object.keys(data).reduce((accumulator, key) => {
      accumulator.push(Object.assign({}, data[key], { id: key }));
      return accumulator;
    }, []);
  }
  return [];
});

const filteredData = createSelector(collectionData, query, ignoreCase, (_data, _query, _ignoreCase) => {
  return _data.filter(itm => {
    let match = true;
    _query.keySeq().toArray().forEach(key => {
      if (_ignoreCase && !itm[key].toString().toLowerCase().match(_query.get(key).toString().toLowerCase())) {
        match = false;
      } else if (!_ignoreCase && !itm[key].match(_query.get(key))) {
        match = false;
      }
    });
    return match;
  });
});

export const filteredOrderedList = createSelector(filteredData, orderBy, (_data, _orderBy) => {
  if (!_orderBy) {
    return _data;
  } else if (_orderBy === 'dateTime') {
    return sort(_data, itm => itm[_orderBy].toDate(), 'desc');
  }
  return sort(_data, itm => itm[_orderBy], 'asc');
});

export const entity = createSelector(collection, entityId, (_collection, _entityId) => {
  return _collection.data ? _collection.data[_entityId] : null;
});
