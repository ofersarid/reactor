import { createSelector } from 'reselect/lib/index';
import JSON5 from 'json5';
import Routes from '/src/routes';
import collections from '../collections';
import pages from '../pages';

const item = createSelector(
  collections.selectors.item,
  collections.selectors.assets,
  pages.selectors.item,
  Routes.selectors.assetId,
  (collection, collectionAssets, page, _assetId) => {
    let asset;
    if (collectionAssets) {
      asset = collectionAssets.find(asset => asset.id === _assetId);
    } else if (page) {
      asset = page.data;
    }
    if (!asset) {
      if (collection) {
        asset = {};
        asset.published = true;
        JSON5.parse(collection.schema).forEach(field => {
          switch (true) {
            // case field.type === 'date-time':
            // case field.type === 'date':
            // case field.type === 'time':
            //   asset[field.key] = undefined;
            //   return;
            default:
              asset[field.key] = '';
          }
        });
      } else if (page) {
        asset = {};
        JSON5.parse(page.schema).forEach(field => {
          switch (true) {
            default:
              asset[field.key] = '';
          }
        });
      }
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
