import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import { Router, hashHistory } from 'react-router';
import rootReducer from './root-reducer';
import Routes from './routes';
import 'babel-polyfill';
import Waves from 'node-waves';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
import 'react-quill/dist/quill.snow.css';
import 'react-image-crop/lib/ReactCrop.scss';
import 'react-tippy/dist/tippy.css';
import styles from './styles.scss';

firebase.initializeApp({
  apiKey: 'AIzaSyCVoJ1fNik-brXSirPwXfzEzpK4HDJyIdE',
  authDomain: 'reactor-dam.firebaseapp.com',
  databaseURL: 'https://reactor-dam.firebaseio.com',
  projectId: 'reactor-dam',
  storageBucket: 'reactor-dam.appspot.com',
  messagingSenderId: '198256799515',
  appId: '1:198256799515:web:3cf8edc02e02434b466dbe'
});
firebase.firestore();

const $root = document.getElementById('root');

$root.className = styles.root;

// export const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer, /* preloadedState, */
  composeEnhancers(
    applyMiddleware(
      thunk.withExtraArgument({ getFirebase, getFirestore }),
    ),
    reduxFirestore(firebase),
    reactReduxFirebase(firebase, {
      userProfile: 'users',
      useFirestoreForProfile: true,
      preserveOnDelete: true,
    }),
  )
);

window.store = store;

ReactDOM.render(
  <Provider store={store} >
    <Router history={hashHistory} routes={Routes} />
  </Provider >,
  $root
);

Waves.attach('.ripple');
Waves.init();
