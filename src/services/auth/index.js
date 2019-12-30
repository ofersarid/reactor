import { fromJS } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import router from '../redux-router';

export const CONST = {
  LOG_IN_ERROR: 'AUTH/LOG_IN_ERROR',
  LOGGING_IN: 'AUTH/LOGGING_IN',
  LOG_IN_SUCCESS: 'AUTH/LOG_IN_SUCCESS',
  LOG_OUT_SUCCESS: 'AUTH/LOG_OUT_SUCCESS',
};

const reducer = (state = fromJS({
  authError: null,
  working: false,
}), action) => {
  switch (action.type) {
    case CONST.LOG_IN_ERROR:
      return state.withMutations(ctx => {
        ctx.set('authError', fromJS(action.err))
          .set('working', false);
      });

    case CONST.LOGGING_IN:
      return state.withMutations(ctx => {
        ctx.set('working', true)
          .set('authError', null);
      });

    case CONST.LOG_IN_SUCCESS:
      return state.withMutations(ctx => {
        ctx.set('working', false);
      });
    default:
      return state;
  }
};

const actions = {
  logIn: credentials => {
    return (dispatch, getState, { getFirebase }) => {
      const firebase = getFirebase();
      dispatch({
        type: CONST.LOGGING_IN,
      });
      return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(resp => {
          dispatch({
            type: CONST.LOG_IN_SUCCESS,
            credentials,
          });
        })
        .catch(err => {
          dispatch({
            type: CONST.LOG_IN_ERROR,
            err,
          });
        });
    };
  },
  logOut: () => {
    return (dispatch, getState, { getFirebase }) => {
      const firebase = getFirebase();
      return firebase.auth().signOut().then(() => {
        dispatch({
          type: CONST.LOG_OUT_SUCCESS,
        });
      });
    };
  },
};

const selectors = {
  authError: state => state.getIn(['auth', 'authError']),
  working: state => state.getIn(['auth', 'working']),
  uid: state => state.get('firebase').auth.uid,
  userCollectionIds: state => state.get('firebase').profile.collections || [],
  userPageIds: state => state.get('firebase').profile.pages || [],
  isLoaded: state => state.get('firebase').auth.isLoaded,
  permissions: state => state.get('firebase').profile.permissions,
};

const HOC = (WrappedComponent) => {
  class Wrapper extends Component {
    // constructor(props) {
    //   super(props);
    // }

    componentDidMount() {
      this.redirect();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      return (nextProps.pathname !== this.props.prevPath) ||
      (!this.props.isLoaded && nextProps.isLoaded);
    }

    componentDidUpdate(prevProps) {
      const { isLoaded, uid, pathname } = this.props;
      if ((isLoaded && !prevProps.isLoaded) || (pathname !== prevProps.pathname) || (uid !== prevProps.uid)) {
        this.redirect();
      }
    }

    redirect() {
      const { uid, isLoaded, isLoginPage } = this.props;
      if (!uid && !isLoaded) return;
      if (!uid) {
        if (!isLoginPage) {
          hashHistory.push('login');
        }
      } else if (isLoginPage) {
        hashHistory.push('cms/home');
      }
    }

    render() {
      const { isLoaded } = this.props;
      return isLoaded ? <WrappedComponent {...this.props} /> : null;
    }
  }

  Wrapper.propTypes = {
    children: PropTypes.any,
    uid: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    prevPath: PropTypes.string.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    isLoginPage: PropTypes.bool.isRequired,
  };

  const mapStateToProps = state => ({
    uid: selectors.uid(state),
    isLoaded: selectors.isLoaded(state),
    pathname: router.selectors.pathname(state),
    prevPath: router.selectors.prevPath(state),
    isLoginPage: Boolean(router.selectors.pathname(state).match(/^\/login/)),
  });

  const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

  return connect(mapStateToProps, mapDispatchToProps)(Wrapper);
};

export default {
  reducer,
  selectors,
  actions,
  HOC,
  CONST,
};
