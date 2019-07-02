import { createSelector } from 'reselect';
import _sortBy from 'lodash/sortBy';

// export const map = (state, collection) => state.get('fireStore').data[collection] || {};

const userPagesMap = state => state.get('fireStore').data.pages || {};

const pages = createSelector(userPagesMap, (pages) => {
  return _sortBy(Object.keys(pages).reduce((accumulator, pageId) => {
    accumulator.push(Object.assign({}, pages[pageId], { id: pageId }));
    return accumulator;
  }, []), item => item.name ? item.name.toLowerCase() : null, ['asc']);
});

export default {
  pages,
};
