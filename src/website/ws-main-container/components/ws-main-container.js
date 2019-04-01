import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/device';
import styles from '../styles.scss';
import { websiteMainContainer } from '../types';

const WebsiteMainContainer = props => (
  <div className={styles.container} >
    {props.children}
  </div >
);

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

WebsiteMainContainer.propTypes = websiteMainContainer;

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteMainContainer);
