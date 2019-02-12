import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';

export const query = state => state.getIn(['filter', 'query']);
export const orderBy = state => state.getIn(['filter', 'orderBy']);
export const ignoreCase = state => state.getIn(['filter', 'ignoreCase']);
export const getOptionsForFilter = (state, collection, key) => {
  const col = state.get('fireStore').ordered[collection] || [];
  return col.reduce((options, entity) => {
    options.push({
      label: entity[key].toString(),
      value: entity[key],
    });
    return uniqWith(options, isEqual);
  }, []);
};
