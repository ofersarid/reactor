import { ACTIONS } from './constants';

export const uploadingFiles = () => ({
  type: ACTIONS.UPLOADING_FILES
});

export const uploadComplete = () => ({
  type: ACTIONS.UPLOAD_COMPLETE
});

export const uploadStatus = (snapshot, id) => ({
  type: ACTIONS.UPLOAD_STATUS,
  payload: {
    [id]: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
  }
});
