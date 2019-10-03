import { fromJS } from 'immutable';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const reducer = (state = fromJS({
  hash: '',
  pathname: '',
  prevPath: '',
  goBackPath: '/cms/home',
  params: {},
  search: '',
  state: '',
}), action) => {
  switch (action.type) {
    case 'ROUTER:LOCATION_CHANGE':
      return state.merge(fromJS(action.route));
    case 'ROUTER:SET_GO_BACK_PATH':
      return state.set('goBackPath', action.path);
    default:
      return state;
  }
};

const actions = {
  updateLocation: route => ({
    type: 'ROUTER:LOCATION_CHANGE',
    route,
  }),
  setGoBackPath: path => ({
    type: 'ROUTER:SET_GO_BACK_PATH',
    path,
  }),
};

const selectors = {
  pathname: state => state.getIn(['router', 'pathname']),
  collectionId: state => state.getIn(['router', 'params', 'collectionId']),
  pageId: state => state.getIn(['router', 'params', 'pageId']),
  prevPath: state => state.getIn(['router', 'prevPath']),
  goBackPath: state => state.getIn(['router', 'goBackPath']),
  assetId: state => state.getIn(['router', 'params', 'assetId']),
};

const HOC = (WrappedComponent) => {
  class Wrapper extends PureComponent {
    constructor(props) {
      super(props);
      props.update(Object.assign({}, {
        params: props.params,
        prevPath: '',
      }, props.location));
      this.state = {
        pathname: '',
        prevPath: '',
      };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.location.pathname !== prevState.pathname) {
        nextProps.update(Object.assign({}, {
          params: nextProps.params,
          prevPath: prevState.pathname,
        }, nextProps.location));
        return {
          pathname: nextProps.location.pathname,
          prevPath: prevState.pathname,
        };
      }
      return null;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  Wrapper.propTypes = {
    location: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
      state: PropTypes.object,
    }).isRequired,
    update: PropTypes.func.isRequired,
    children: PropTypes.any,
    params: PropTypes.object.isRequired,
  };

  const mapDispatchToProps = dispatch => ({
    update: (...props) => dispatch(actions.updateLocation(...props)),
  });

  return connect(() => ({}), mapDispatchToProps)(Wrapper);
};

export default {
  reducer,
  selectors,
  actions,
  HOC,
};
