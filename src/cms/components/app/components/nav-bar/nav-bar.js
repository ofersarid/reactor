import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { LogOutCircle } from 'styled-icons/boxicons-regular/LogOutCircle';
import { Button } from '/src/cms/components';
import Routes from '/src/routes';
import Auth from '/src/cms/components/auth';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const NavBar = ({ logOut, uid, pathname }) => (
  <div className={cx(styles.navBar)} >
    <div className={styles.navBarTitle}>REACTOR</div>
    {uid && pathname === '/cms/home' && (
      <Button type="icon" className={cx(styles.toTheLeft, styles.btn)} onClick={logOut} >
        <LogOutCircle />
      </Button>
    )}
  </div >
);

NavBar.propTypes = {
  logOut: PropTypes.func.isRequired,
  uid: PropTypes.string,
  pathname: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  uid: Auth.selectors.uid(state),
  pathname: Routes.selectors.pathname(state),
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(Auth.actions.logOut()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NavBar);
