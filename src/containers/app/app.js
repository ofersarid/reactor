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
import { Home, Editor, CollectionAssets, Schema, Login, SchemaEditor } from '/src/containers';
import cx from 'classnames';
import styles from './styles.scss';
import NavBar from './nav-bar';
import Menu from './menu';

const pages = [
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><Login />
  </animated.div >,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><Menu />
  </animated.div >,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><Home />
  </animated.div >,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><CollectionAssets />
  </animated.div >,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><Editor />
  </animated.div >,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><Schema />
  </animated.div >,
  springs => <animated.div className={cx('pageContainer', styles.pageContainer)} style={springs} ><SchemaEditor />
  </animated.div >
];

const resolvePageIndex = (pathname, menuIsOpen) => {
  switch (true) {
    case menuIsOpen:
      return 1;
    case Boolean(pathname.match('/cms/home')):
      return 2;
    case Boolean(pathname.match('/cms/collection')) && !pathname.match('editor') && !pathname.match('schema'):
      return 3;
    case Boolean(pathname.match(/schema\/.*editor/)):
      return 6;
    case Boolean(pathname.match('editor')):
      return 4;
    case Boolean(pathname.match('schema')):
      return 5;
    case Boolean(pathname.match('/login')):
    default:
      return 0;
  }
};

let MENU_WAS_OPEN = false;

const APP = ({ pathname, isLoaded, prevPath, menuIsOpen }) => {
  const pageIndex = resolvePageIndex(pathname, menuIsOpen);
  const pageIndexPrev = resolvePageIndex(prevPath, menuIsOpen);
  const direction = ((pageIndex > pageIndexPrev) && !menuIsOpen) || MENU_WAS_OPEN ? 'right' : 'left';
  MENU_WAS_OPEN = menuIsOpen;

  return isLoaded ? (
    <div className={styles.main} >
      <NavBar show={Boolean(pageIndex)} />
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
  menuIsOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoaded: services.auth.selectors.isLoaded(state),
  userPageIds: services.auth.selectors.userPageIds(state),
  pathname: services.router.selectors.pathname(state),
  prevPath: services.router.selectors.prevPath(state),
  menuIsOpen: services.app.selectors.menuIsOpen(state),
});

export default compose(
  connect(mapStateToProps, {}),
  withRouter,
  device.HOC,
  reduxRouter.HOC,
  auth.HOC,
)(APP);
