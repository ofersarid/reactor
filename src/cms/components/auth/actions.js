import { ACTIONS } from './constants';

export const logIn = credentials => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    dispatch({
      type: ACTIONS.LOGGING_IN,
    });
    return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(resp => {
        dispatch({
          type: ACTIONS.LOG_IN_SUCCESS,
          credentials,
        });
      })
      .catch(err => {
        dispatch({
          type: ACTIONS.LOG_IN_ERROR,
          err,
        });
      });
  };
};

export const logOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    return firebase.auth().signOut().then(() => {
      dispatch({
        type: ACTIONS.LOG_OUT_SUCCESS,
      });
    });
  };
};
