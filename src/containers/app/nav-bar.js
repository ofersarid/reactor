import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import autoBind from 'auto-bind';
import { actionTypes } from 'redux-firestore';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { PowerOff } from 'styled-icons/boxicons-regular/PowerOff';
import { KeyboardArrowLeft } from 'styled-icons/material/KeyboardArrowLeft';
import { Menu } from 'styled-icons/material/Menu';
import { Close } from 'styled-icons/material/Close';
import { Button, UserInput } from '/src/shared';
import services from '/src/services';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import SecondaryNav from './secondary-nav';

class NavBar extends React.PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      openMenu: false,
    };
  }

  goBack() {
    const { goBackPath } = this.props;
    hashHistory.push(goBackPath);
  }

  logOut() {
    const { logOut, clearData } = this.props;
    logOut();
    clearData();
  }

  render() {
    const {
      uid, pathname, appTitle, show, listName, selectList,
      menuIsOpen, toggleMenu
    } = this.props;
    const isHomePage = Boolean(pathname.match('/cms/home'));
    return (
      <div className={cx(styles.navBar, { [styles.show]: show, [styles.hideShadow]: isHomePage })} >
        <SecondaryNav show={isHomePage} >
          <UserInput
            type="switch"
            options={['collections', 'pages']}
            value={listName}
            onChange={selectList}
            className={styles.tabSection}
          />
        </SecondaryNav >
        <div className={styles.navBarInner} >
          <div
            className={cx(styles.navBarTitle, { [styles.isReactorLogo]: isHomePage })}
          >
            <span >{appTitle || '...'}</span >
          </div >
          {(uid && pathname === '/cms/home') && !menuIsOpen && (
            <Button type="icon" className={cx(styles.toTheLeft, styles.btn)} onClick={this.logOut} >
              <PowerOff />
            </Button >
          )}
          {(uid && pathname !== '/cms/home' && pathname !== '/cms/login') && !menuIsOpen && (
            <Button type="icon" className={cx(styles.toTheLeft, styles.btn)} onClick={this.goBack} >
              <KeyboardArrowLeft className={styles.arrowLeft} />
            </Button >
          )}
          {uid && (
            <Button type="icon" className={cx(styles.btn, styles.menuToggle, styles.toTheRight)} onClick={toggleMenu} >
              {menuIsOpen ? <Close /> : <Menu />}
            </Button >
          )}
        </div >
      </div >
    );
  }
}

NavBar.propTypes = {
  logOut: PropTypes.func.isRequired,
  uid: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  appTitle: PropTypes.string,
  goBackPath: PropTypes.string.isRequired,
  show: PropTypes.bool,
  clearData: PropTypes.func.isRequired,
  listName: PropTypes.string.isRequired,
  selectList: PropTypes.func.isRequired,
  menuIsOpen: PropTypes.bool.isRequired,
  devMode: PropTypes.bool.isRequired,
  toggleDevMode: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  uid: services.auth.selectors.uid(state),
  pathname: services.router.selectors.pathname(state),
  goBackPath: services.router.selectors.goBackPath(state),
  appTitle: services.app.selectors.headerTitle(state),
  listName: services.home.selectors.listName(state),
  devMode: services.app.selectors.devMode(state),
  menuIsOpen: services.app.selectors.menuIsOpen(state),
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(services.auth.actions.logOut()),
  clearData: () => dispatch({
    type: actionTypes.CLEAR_DATA,
  }),
  selectList: (...props) => dispatch(services.home.actions.selectList(...props)),
  toggleDevMode: () => dispatch(services.app.actions.toggleDevMode()),
  toggleMenu: () => dispatch(services.app.actions.toggleMenu()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NavBar);
