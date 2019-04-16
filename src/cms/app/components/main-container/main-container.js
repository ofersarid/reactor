import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/device';
import { mainContainer } from '../../types';
import Routes from '/src/routes';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import Auth from '/src/cms/auth';
import { ToastContainer } from 'react-toastify';
import AuthRedirect from '/src/cms/auth/components/auth-redirect/auth-redirect';
import CMSNavBar from '../tool-bar/cms-nav-bar';
import SideNav from '../side-nav/side-nav';
import styles from './styles.scss';
import 'react-quill/dist/quill.snow.css';
import 'react-image-crop/lib/ReactCrop.scss';
import 'react-tippy/dist/tippy.css';

const MainContainer = props => props.isLoaded ? (
  <AuthRedirect >
    <Device />
    <div className={styles.main} >
      <SideNav />
      <div className={styles.stage} >
        <CMSNavBar />
        <div className={styles.page}>
          {props.children}
        </div>
      </div >
      <ToastContainer />
    </div >
  </AuthRedirect >
) : null;

MainContainer.propTypes = mainContainer;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
  isLoaded: Auth.selectors.isLoaded(state),
  isCMS: Routes.selectors.isCMS(state),
  uid: Auth.selectors.uid(state),
});

export default compose(
  connect(mapStateToProps, {}),
  withRouter,
)(MainContainer);
