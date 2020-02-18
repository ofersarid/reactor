import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import services from '/src/services';
import { Button } from '/src/shared';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const Menu = (
  {
    toggleDevMode,
    devMode,
  }) => (
  <div className={cx(styles.menu)} >
    <section className={styles.menuTopSection} >
      <Button type="white" className={cx(styles.menuItem, styles.btn)} linkTo="/cms/home" >
        Go Home
      </Button >
    </section >
    <section className={styles.menuBottomSection} >
      <Button
        type={devMode ? 'red-bold' : 'red'}
        className={cx(styles.menuItem, styles.btn)}
        linkTo="/cms/home"
        onClick={toggleDevMode}
      >
        {devMode ? 'Exit Developer Mode' : 'Developer Mode'}
      </Button >
    </section >
  </div >
);

Menu.propTypes = {
  menuIsOpen: PropTypes.bool.isRequired,
  toggleDevMode: PropTypes.func.isRequired,
  devMode: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  menuIsOpen: services.app.selectors.menuIsOpen(state),
  devMode: services.app.selectors.devMode(state),
});

const mapDispatchToProps = dispatch => ({
  toggleDevMode: () => dispatch(services.app.actions.toggleDevMode()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Menu);
