import { fromJS } from 'immutable';
import { ACTIONS } from './constants';

const initialState = fromJS({
  uploadingFiles: false,
  uploadStatus: {},
});

const activityIndicator = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.UPLOADING_FILES:
      return state.set('uploadingFiles', true);

    case ACTIONS.UPLOAD_STATUS:
      return state.mergeIn(['uploadStatus'], fromJS(action.payload));

    case ACTIONS.UPLOAD_COMPLETE:
      return initialState;

    default:
      return state;
  }
};

export default activityIndicator;
