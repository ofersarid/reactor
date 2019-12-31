import { createSelector } from 'reselect/lib/index';
import JSON5 from 'json5';
import collectionsSelectors from '../collections/selectors';
import pages from '../pages';

const item = state => state.get('fireStore').data.asset;

const fields = createSelector(
  collectionsSelectors.item,
  pages.selectors.item,
  (collection, page) => {
    switch (true) {
      // get fields from collection.
      case Boolean(collection):
        return JSON5.parse(collection.schema);

      // get fields from page.
      case Boolean(page):
        return JSON5.parse(page.schema);

      // can't get fields
      default:
        return undefined;
    }
  });

export default {
  item,
  fields,
};
