import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device/index';
import types from './types';

const About = () => (
  <Fragment >
    About Page
  </Fragment >
);

About.propTypes = types;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

export default connect(mapStateToProps, {})(About);
