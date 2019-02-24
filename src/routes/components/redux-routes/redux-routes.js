import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { reduxRoutes } from '../../types';
import { updateLocation } from '../../actions';

class ReduxRoutes extends Component {
  constructor(props) {
    super(props);
    props.update(props.location);
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.location, prevState.location)) {
      nextProps.update(Object.assign({}, { params: nextProps.params }, nextProps.location));
    }
    return {};
  }

  render() {
    const { children } = this.props;
    return (
      <Fragment >
        {children}
      </Fragment >
    );
  }
}

ReduxRoutes.propTypes = reduxRoutes;

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({
  update: (...props) => dispatch(updateLocation(...props)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(ReduxRoutes);
