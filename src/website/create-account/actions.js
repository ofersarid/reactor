export const setUpAccount = ({ name, email, password, companyName, websiteURL, industry }) =>
  (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log('creating account');
    // const firestore = getFirestore();
    const firebase = getFirebase();
    createUser(email, password, firebase).then(resp => {
      console.log(resp);
    });
  };

const createUser = (email, password, firebase) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    console.error(error.code);
    // const errorMessage = error.message;
    // ...
  });
};
