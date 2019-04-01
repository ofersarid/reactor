import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/device';
import styles from './styles.scss';
import { stage } from '../../types';
import { compose } from 'redux';
import { withRouter } from 'react-router';

const Stage = props => (
  <div className={styles.stage} >
    {props.children}
  </div >
);

Stage.propTypes = stage;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

export default compose(
  connect(mapStateToProps, {}),
  withRouter,
)(Stage);
