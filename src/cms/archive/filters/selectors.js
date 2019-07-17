// import uniqWith from 'lodash/uniqWith';
// import isEqual from 'lodash/isEqual';
// import { createSelector } from 'reselect';
// import { collection } from '/src/cms/collections/selectors';

export const query = state => state.getIn(['filter', 'query']);
export const orderBy = state => state.getIn(['filter', 'orderBy']);
export const ignoreCase = state => state.getIn(['filter', 'ignoreCase']);
