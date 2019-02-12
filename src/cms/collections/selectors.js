import { createSelector } from 'reselect';
import { pathname } from '/src/routes/selectors';
import { query, ignoreCase, orderBy } from '/src/cms/filters/selectors';
import sort from 'lodash/orderBy';

const list = (state, collection) => state.get('fireStore').ordered[collection] || [];

const filteredList = createSelector(list, query, ignoreCase, (_list, _query, _ignoreCase) => {
  return _list.filter(itm => {
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

export const filteredOrderedList = createSelector(filteredList, orderBy, (_list, _orderBy) => {
  if (_list[0] && _list[0][_orderBy]) {
    if (_orderBy === 'dateTime') {
      return sort(_list, itm => itm[_orderBy].toDate(), 'desc');
    }
    return sort(_list, itm => itm[_orderBy], 'asc');
  }
  return _list;
});

export const map = (state, collection) => state.get('fireStore').data[collection] || {};

export const entityById = (id, collection, state) => map(state, collection)[id];

export const entitySelector = (state, collection, route) => {
  const coll = state.get('fireStore').data[collection] || {};
  const getId = () => pathname(state).split(`${route}/edit/`)[1];
  return coll[getId()];
};

export const settings = state => state.get('fireStore').data.settings || {};
