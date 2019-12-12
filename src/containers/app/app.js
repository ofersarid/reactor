import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import device from '/src/services/device';
import reduxRouter from '/src/services/redux-router';
import auth from '/src/services/auth';
import PropTypes from 'prop-types';
import { Transition, animated } from 'react-spring/renderprops';
import { withRouter } from 'react-router';
import services from '/src/services';
import { Home, LoginPage, Editor, CollectionAssets, Schema } from '/src/containers';
import cx from 'classnames';
import styles from './styles.scss';
import NavBar from './nav-bar';

const pages = [
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><LoginPage /></animated.div>,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><Home /></animated.div>,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><CollectionAssets /></animated.div>,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><Editor /></animated.div>,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><Schema /></animated.div>
];

const resolvePageIndex = pathname => {
  switch (true) {
    case pathname === '/cms/home':
      return 1;
    case Boolean(pathname.match('/cms/collection')) && !pathname.match('editor') && !pathname.match('schema'):
      return 2;
    case Boolean(pathname.match('editor')):
      return 3;
    case Boolean(pathname.match('schema')):
      return 4;
    default:
      return 0;
  }
};

const APP = ({ pathname, isLoaded, prevPath }) => {
  const pageIndex = resolvePageIndex(pathname);
  const pageIndexPrev = resolvePageIndex(prevPath);
  const direction = pageIndex > pageIndexPrev ? 'right' : 'left';

  return isLoaded ? (
    <div className={styles.main} >
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
    </div >
  ) : null;
};

APP.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  userPageIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  pathname: PropTypes.string.isRequired,
  prevPath: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  isLoaded: services.auth.selectors.isLoaded(state),
  userPageIds: services.auth.selectors.userPageIds(state),
  pathname: services.router.selectors.pathname(state),
  prevPath: services.router.selectors.prevPath(state),
});

export default compose(
  connect(mapStateToProps, {}),
  withRouter,
  device.HOC,
  reduxRouter.HOC,
  auth.HOC,
)(APP);
