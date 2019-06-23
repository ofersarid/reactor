import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Device from '/src/device';
// import { mainContainer } from '../../types';
import Routes from '/src/routes';
import { withRouter } from 'react-router';
import Auth from '/src/cms/components/auth';
// import { ToastContainer } from 'react-toastify';
import AuthRedirect from '/src/cms/components/auth/components/auth-redirect/auth-redirect';
// import CMSNavBar from '../tool-bar/cms-nav-bar';
// import SideNav from '../side-nav/side-nav';
import styles from './styles.scss';
import 'react-quill/dist/quill.snow.css';
import 'react-image-crop/lib/ReactCrop.scss';
import 'react-tippy/dist/tippy.css';
import PropTypes from 'prop-types';
import cx from 'classnames';

const MainContainer = props => props.isLoaded ? (
  <AuthRedirect >
    <Device />
    <div className={styles.main} >
      {/* <SideNav /> */}
      {/* <div className={styles.stage} > */}
      <div className={cx(styles.navBar)} >
        {/* <LeftCol /> */}
        {/* <RightCol /> */}
      </div >
      <div className={styles.pageContainer} >
        {props.children}
      </div >
      {/* </div > */}
      {/* <ToastContainer /> */}
    </div >
  </AuthRedirect >
) : null;

MainContainer.propTypes = {
  children: PropTypes.any,
  isLoaded: PropTypes.bool.isRequired,
  isCMS: PropTypes.bool.isRequired,
  // uid: PropTypes.string,
};

const mapStateToProps = state => ({
  // deviceType: Device.selectors.deviceType(state),
  // deviceOrientation: Device.selectors.deviceOrientation(state),
  isLoaded: Auth.selectors.isLoaded(state),
  isCMS: Routes.selectors.isCMS(state),
  // uid: Auth.selectors.uid(state),
});

export default compose(
  connect(mapStateToProps, {}),
  withRouter,
)(MainContainer);
