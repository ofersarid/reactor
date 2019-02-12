import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

// Initialize Firebase - Update this with client specific credentials
export const config = {
  apiKey: 'AIzaSyBF_ouTjRvczqEzaNiIHvdguL_-Bqis-Wg',
  authDomain: 'goblins-saas.firebaseapp.com',
  databaseURL: 'https://goblins-saas.firebaseio.com',
  projectId: 'goblins-saas',
  storageBucket: 'goblins-saas.appspot.com',
  messagingSenderId: '898394464841'
};

firebase.initializeApp(config);
firebase.firestore();

export default firebase;
