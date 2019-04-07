import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

// Initialize Firebase - Update this with client specific credentials
export const config = {
  apiKey: 'AIzaSyCVoJ1fNik-brXSirPwXfzEzpK4HDJyIdE',
  authDomain: 'reactor-dam.firebaseapp.com',
  databaseURL: 'https://reactor-dam.firebaseio.com',
  projectId: 'reactor-dam',
  storageBucket: 'reactor-dam.appspot.com',
  messagingSenderId: '198256799515'
};

firebase.initializeApp(config);
firebase.firestore();

export default firebase;
