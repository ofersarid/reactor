import { combineReducers } from 'redux-immutable';
import { firestoreReducer as fireStore } from 'redux-firestore';
import { firebaseReducer as firebase } from 'react-redux-firebase';
import auth from '/src/shared/auth/reducers';
// import activity from '/src/cms/activity/reducers';
// import filter from '/src/cms/filters/reducers';
import services from '/src/services';
import splashScreen from './shared/splash-screen/reducers';

const rootReducer = combineReducers({
  router: services.router.reducer,
  device: services.device.reducer,
  auth,
  fireStore,
  firebase,
  // activity,
  // filter,
  blacklist: services.blackList.reducer,
  home: services.home.reducer,
  splashScreen,
  app: services.app.reducer,
});

export default rootReducer;
