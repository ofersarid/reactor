import { ACTIONS } from './constants';

const selectList = list => {
  return {
    type: ACTIONS.SELECT_LIST,
    list,
  };
};

export default {
  selectList,
};
