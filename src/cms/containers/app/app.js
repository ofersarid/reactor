import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Device from '/src/device';
import PropTypes from 'prop-types';
import Routes from '/src/routes';
// import { firestoreConnect } from 'react-redux-firebase';
import { Transition, animated } from 'react-spring/renderprops';
// import { mainContainer } from '../../types';
// import Routes from '/src/routes';
import { withRouter } from 'react-router';
import Auth from '/src/cms/shared/auth';
import { Home, LoginPage, Editor, CollectionAssets } from '/src/cms/containers';
// import { ToastContainer } from 'react-toastify';
import AuthRedirect from '/src/cms/shared/auth/components/auth-redirect';
// import CMSNavBar from '../tool-bar/cms-nav-bar';
// import SideNav from '../side-nav/side-nav';
import styles from './styles.scss';
import 'react-quill/dist/quill.snow.css';
import 'react-image-crop/lib/ReactCrop.scss';
import 'react-tippy/dist/tippy.css';
import cx from 'classnames';
import NavBar from './components/nav-bar/nav-bar';

const pages = [
  springs => <animated.div className={cx(styles.pageContainer)} style={springs} ><LoginPage /></animated.div>,
  springs => <animated.div className={cx(styles.pageContainer)} style={springs} ><Home /></animated.div>,
  springs => <animated.div className={cx(styles.pageContainer)} style={springs} ><CollectionAssets /></animated.div>,
  springs => <animated.div className={cx(styles.pageContainer)} style={springs} ><Editor /></animated.div>
];

const resolvePageIndex = pathname => {
  switch (true) {
    case pathname === '/cms/login':
      return 0;
    case pathname === '/cms/home':
      return 1;
    case Boolean(pathname.match('/cms/collection')) && !pathname.match('editor'):
      return 2;
    case Boolean(pathname.match('editor')):
      return 3;
    default:
      return 0;
  };
};

const APP = ({ pathname, isLoaded, prevPath }) => {
  const pageIndex = resolvePageIndex(pathname);
  const pageIndexPrev = resolvePageIndex(prevPath);
  const direction = pageIndex > pageIndexPrev ? 'right' : 'left';

  return isLoaded ? (
    <AuthRedirect >
      <Device />
      <div className={styles.main} >
        {/* <SideNav /> */}
        {/* <div className={styles.stage} > */}
        <NavBar />
        <Transition
          native
          reset
          unique
          items={pageIndex}
          from={{ marginLeft: `${direction === 'right' ? '100%' : '-100%'}`, opacity: 0 }}
          enter={{ marginLeft: '0', opacity: 1 }}
          leave={{ marginLeft: `${direction === 'right' ? '-50%' : '50%'}`, opacity: 0 }} >
          {index => pages[index]}
        </Transition >
        {/* </div > */}
        {/* <ToastContainer /> */}
      </div >
    </AuthRedirect >
  ) : null;
};

APP.propTypes = {
  // children: PropTypes.any,
  isLoaded: PropTypes.bool.isRequired,
  // userCollectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  userPageIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  pathname: PropTypes.string.isRequired,
  prevPath: PropTypes.string.isRequired,
  // uid: PropTypes.string,
};

const mapStateToProps = state => ({
  // deviceType: Device.selectors.deviceType(state),
  // deviceOrientation: Device.selectors.deviceOrientation(state),
  isLoaded: Auth.selectors.isLoaded(state),
  // uid: Auth.selectors.uid(state),
  // userCollectionIds: Auth.selectors.userCollectionIds(state),
  userPageIds: Auth.selectors.userPageIds(state),
  pathname: Routes.selectors.pathname(state),
  prevPath: Routes.selectors.prevPath(state),
});

export default compose(
  connect(mapStateToProps, {}),
  withRouter,
  // firestoreConnect(props => {
  //   let aggregated = [];
  //   aggregated = aggregated.concat(props.userCollectionIds.reduce((accumulator, id) => {
  //     accumulator.push({
  //       collection: 'collections',
  //       doc: id,
  //     });
  //     accumulator.push({
  //       collection: 'collections',
  //       doc: id,
  //       subcollections: [{
  //         collection: 'data',
  //         // where: [['active', '==', true]],
  //         // orderBy: ['displayOrder', 'desc'],
  //       }],
  //     });
  //     return accumulator;
  //   }, []));
  //   aggregated = aggregated.concat(props.userPageIds.reduce((accumulator, id) => {
  //     accumulator.push({
  //       collection: 'pages',
  //       doc: id,
  //     });
  //     return accumulator;
  //   }, []));
  //   return aggregated;
  // }),
)(APP);
