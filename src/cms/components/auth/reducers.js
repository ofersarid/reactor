import { fromJS } from 'immutable/dist/immutable-nonambient';
import { ACTIONS } from './constants';

const initialState = fromJS({
  authError: null,
  working: false,

});

const auth = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOG_IN_ERROR:
      return state.withMutations(ctx => {
        ctx.set('authError', fromJS(action.err))
          .set('working', false);
      });

    case ACTIONS.LOGGING_IN:
      return state.withMutations(ctx => {
        ctx.set('working', true)
          .set('authError', null);
      });

    case ACTIONS.LOG_IN_SUCCESS:
      return state.withMutations(ctx => {
        ctx.set('working', false);
      });

    default:
      return state;
  }
};

export default auth;
