import { ACTIONS } from './constants';
//
// export const toggleSideNav = () => ({
//   type: ACTIONS.TOGGLE_SIDE_NAV
// });
//
// export const toggleDeleteMode = () => ({
//   type: ACTIONS.TOGGLE_DELETE_MODE
// });
//
// export const markForDelete = item => {
//   return {
//     type: ACTIONS.MARK_FOR_DELETE,
//     item,
//   };
// };
//
const storeBlackList = ids => {
  return {
    type: ACTIONS.STORE_DELETED_IDS_HACK,
    ids,
  };
};

export default {
  storeBlackList,
};
