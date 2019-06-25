import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { PowerOff } from 'styled-icons/boxicons-regular/PowerOff/PowerOff';
import { Button } from '/src/cms/components';
import Auth from '/src/cms/components/auth';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const NavBar = ({ logOut, uid }) => (
  <div className={cx(styles.navBar)} >
    <div className={styles.navBarTitle}>REACTOR</div>
    {uid && (
      <Button type="icon" className={styles.toTheRight} onClick={logOut}>
        <PowerOff />
      </Button>
    )}
  </div >
);

NavBar.propTypes = {
  logOut: PropTypes.func.isRequired,
  uid: PropTypes.string,
};

const mapStateToProps = state => ({
  uid: Auth.selectors.uid(state),
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(Auth.actions.logOut()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NavBar);
