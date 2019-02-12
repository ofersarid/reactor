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
    this.state = {
      location: props.location,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.location, prevState.location)) {
      nextProps.update(nextProps.location);
    }
    return {
      location: nextProps.location,
    };
  }

  // componentDidUpdate(prevProps) {
  //   const { location } = this.props;
  //   if (!isEqual(location, this.state.location)) {
  //     this.setState({ location });
  //   }
  // }

  updateLocation(location) {
    const { update } = this.props;
    update(location);
    this.setState({ location });
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
