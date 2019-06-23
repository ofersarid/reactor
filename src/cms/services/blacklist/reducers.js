import { fromJS } from 'immutable';
import { ACTIONS } from './constants';
// import Routes from '/src/routes';

const initialState = fromJS({
  // sideNavOpen: true,
  // deleteMode: false,
  // markedForDelete: [],
  blackList: [],
});

const blacklist = (state = initialState, action) => {
  switch (action.type) {
    // case ACTIONS.TOGGLE_SIDE_NAV:
    //   return state.set('sideNavOpen', !state.get('sideNavOpen'));
    //
    // case ACTIONS.MARK_FOR_DELETE:
    //   let list = state.get('markedForDelete').filterNot(itm => itm.get('id') === action.item.id);
    //   if (list.size === state.get('markedForDelete').size) {
    //     return state.set('markedForDelete', state.get('markedForDelete').concat(fromJS([action.item])));
    //   } else {
    //     return state.set('markedForDelete', list);
    //   }
    //
    // case ACTIONS.TOGGLE_DELETE_MODE:
    //   return state.withMutations(ctx =>
    //     ctx.set('deleteMode', !state.get('deleteMode'))
    //       .set('markedForDelete', fromJS([]))
    //   );

    case ACTIONS.STORE_DELETED_IDS_HACK:
      return state.set('blackList', state.get('blackList').concat(action.ids));

      // case Routes.consts.ACTIONS.LOCATION_CHANGE:
      //   return state.withMutations(ctx =>
      //     ctx.set('deleteMode', false)
      //       .set('markedForDelete', fromJS([]))
      //   );

    default:
      return state;
  }
};

export default blacklist;
