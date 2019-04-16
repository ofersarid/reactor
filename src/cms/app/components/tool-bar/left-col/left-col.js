import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/device';
import Routes from '/src/routes/index';
import styles from './styles.scss';
import types from './types';

const LeftCol = props => (
  <div className={styles.leftCol} >

  </div >
);

LeftCol.propTypes = types;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
  pathname: Routes.selectors.pathname(state),
});

export default connect(mapStateToProps, {})(LeftCol);
