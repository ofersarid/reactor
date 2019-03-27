const createUser = (email, password, firebase) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const setUpAccount = ({ name, email, password }) =>
  (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log('creating account');
    const firestore = getFirestore();
    const firebase = getFirebase();
    return createUser(email, password, firebase).then(resp => {
      if (resp) {
        firestore.collection('users').doc(resp.user.uid).set({ name });
      }
    });
  };
