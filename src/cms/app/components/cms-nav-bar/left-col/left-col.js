import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import Popover from '/src/cms/elements/popover/popover';
import styles from './styles.scss';
import types from './types';
import logo from './logo.svg';
import { version } from '../../../../../../package.json';

const LeftCol = () => (
  <div className={styles.leftCol} >
    <Popover
      position="bottom"
      content={(
        <div className={styles.logoTip} >
          Version: {version}
        </div >
      )}
    >
      <img className={styles.logo} src={logo} />
    </Popover >
  </div >
);

LeftCol.propTypes = types;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

export default connect(mapStateToProps, {})(LeftCol);
