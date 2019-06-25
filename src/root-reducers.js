import { combineReducers } from 'redux-immutable';
import device from '/src/device/reducers';
import { firestoreReducer as fireStore } from 'redux-firestore';
import { firebaseReducer as firebase } from 'react-redux-firebase';
import auth from '/src/cms/components/auth/reducers';
import routs from '/src/routes/reducers';
import activity from '/src/cms/activity/reducers';
import filter from '/src/cms/filters/reducers';
import services from '/src/cms/services';
import splashScreen from './cms/components/splash-screen/reducers';

const rootReducer = combineReducers({
  router: routs,
  device,
  auth,
  fireStore,
  firebase,
  activity,
  filter,
  blacklist: services.blackList.reducers,
  home: services.home.reducers,
  splashScreen,
});

export default rootReducer;
