import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import firebase from '../firebase.config';
import { Router, hashHistory } from 'react-router';
import rootReducer from './cms/root-reducers';
import Routes from '/src/routes';
import Waves from 'node-waves';
import './fonts/fonts.scss';
import styles from './styles.scss';

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

ReactDOM.render(
  <Provider store={store} >
    <Router history={hashHistory} routes={Routes.routesMap} />
  </Provider >,
  $root
);

Waves.attach('.ripple');
Waves.init();
