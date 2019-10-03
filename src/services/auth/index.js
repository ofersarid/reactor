import { fromJS } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import router from '../redux-router';

const reducer = (state = fromJS({
  authError: null,
  working: false,
}), action) => {
  switch (action.type) {
    case 'AUTH:LOG_IN_ERROR':
      return state.withMutations(ctx => {
        ctx.set('authError', fromJS(action.err))
          .set('working', false);
      });

    case 'AUTH:LOGGING_IN':
      return state.withMutations(ctx => {
        ctx.set('working', true)
          .set('authError', null);
      });

    case 'AUTH/LOG_IN_SUCCESS':
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
        type: 'AUTH:LOGGING_IN',
      });
      return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(resp => {
          dispatch({
            type: 'AUTH:LOG_IN_SUCCESS',
            credentials,
          });
        })
        .catch(err => {
          dispatch({
            type: 'AUTH:LOG_IN_ERROR',
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
          type: 'AUTH:LOG_OUT_SUCCESS',
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
    constructor(props) {
      super(props);
      this.redirect();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
      return nextProps.pathname !== this.props.prevPath;
    }

    componentDidUpdate(prevProps) {
      const { uid } = this.props;
      if (uid !== prevProps.uid) {
        this.redirect();
      }
    }

    redirect() {
      const { uid, pathname } = this.props;
      if (!uid) {
        if (pathname !== '/cms/login') {
          hashHistory.push('cms/login');
        }
      } else if (pathname.match(/^\/cms\/login/)) {
        hashHistory.push('/cms/home');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  Wrapper.propTypes = {
    children: PropTypes.any,
    uid: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    prevPath: PropTypes.string.isRequired,
  };

  const mapStateToProps = state => ({
    uid: selectors.uid(state),
    pathname: router.selectors.pathname(state),
    prevPath: router.selectors.prevPath(state),
  });

  const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

  return connect(mapStateToProps, mapDispatchToProps)(Wrapper);
};

export default {
  reducer,
  selectors,
  actions,
  HOC,
};
