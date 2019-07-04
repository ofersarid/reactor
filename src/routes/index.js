
import * as types from './types';
import * as consts from './constants';
import routesMap from './routes-map';

export default {
  actions: require('./actions').default,
  selectors: require('./selectors').default,
  consts,
  types,
  routesMap,
};
