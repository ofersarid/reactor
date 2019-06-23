import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Device from '/src/device';
import { navBar } from '../../types';
import styles from '../../styles.scss';
// import LeftCol from './left-col/left-col';
// import RightCol from './right-col/right-col';

const CMSNavBar = props => (
  <div className={cx(styles.navBar)} >
    {/* <LeftCol /> */}
    {/* <RightCol /> */}
  </div >
);

CMSNavBar.propTypes = navBar;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
});

export default connect(mapStateToProps, {})(CMSNavBar);
