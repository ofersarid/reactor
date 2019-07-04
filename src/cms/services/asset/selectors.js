import { createSelector } from 'reselect';
import { assetId } from '/src/routes/selectors';
import collections from '../collections';
import pages from '../pages';

const item = createSelector(
  collections.selectors.item,
  collections.selectors.assets,
  assetId,
  (collection, collectionAssets, _assetId) => {
    let asset = collectionAssets ? collectionAssets.find(asset => asset.id === _assetId) : undefined;
    if (collection && !asset) {
      asset = {};
      asset.published = true;
      collection.fields.forEach(field => {
        switch (true) {
          case field.type === 'date-time':
          case field.type === 'date':
          case field.type === 'time':
            asset[field.key] = undefined;
            return;
          default:
            asset[field.key] = '';
        }
      });
    }
    return asset;
  });

const fields = createSelector(
  collections.selectors.item,
  pages.selectors.item,
  (collection, page) => {
    switch (true) {
      // get fields from collection.
      case Boolean(collection):
        return collection.fields;

      // get fields from page.
      case Boolean(page):
        return page.fields;

      // can't get fields return empty array
      default:
        return undefined;
    }
  });

export default {
  item,
  fields,
};
