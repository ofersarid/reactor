import { combineReducers } from 'redux-immutable';
import device from '/src/cms/device/reducers';
import auth from '/src/cms/auth/reducers';
import routs from '/src/routes/reducers';
import activity from '/src/cms/activity/reducers';
import { firestoreReducer as fireStore } from 'redux-firestore';
import { firebaseReducer as firebase } from 'react-redux-firebase';
import filter from '/src/cms/filters/reducers';
import app from '/src/cms/app/reducers';

const rootReducer = combineReducers({
  router: routs,
  device,
  auth,
  fireStore,
  firebase,
  activity,
  filter,
  app,
});

export default rootReducer;
