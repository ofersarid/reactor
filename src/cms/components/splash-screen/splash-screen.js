import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const SplashScreen = ({ children }) => (
  <div className={cx(styles.splashScreen)} >{children}</div >
);

SplashScreen.propTypes = {
  children: PropTypes.any,
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SplashScreen);
