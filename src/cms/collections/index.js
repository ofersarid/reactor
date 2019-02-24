import * as _selectors from './selectors';

// export const selectors = _selectors;
export { default as CollectionContainer } from './components/collection-container/collection-container';
export { default as CollectionEditor } from './components/collection-editor/collection-editor';
export { default as GeneralAssets } from './components/settings/general-assets/general-assets';
export { default as propTypes } from './types';

export default {
  selectors: _selectors,
};
