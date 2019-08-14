import React from 'react';
import cx from 'classnames';
import { Keyframes } from 'react-spring/renderprops-universal';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import delay from 'delay/index';
import actions from './actions';
import styles from './styles.scss';

const SpringContainer = Keyframes.Spring({
  showAndHide: async (next, cancel, ownProps) => {
    await next({
      from: { transform: 'scale(1)', opacity: 1 },
      to: { transform: 'scale(1)', opacity: 1 },
    });
    await delay(1500);
    await next({
      from: { transform: 'scale(1)', opacity: 1 },
      to: { transform: 'scale(0.8)', opacity: 0 },
    });
  }
});

const SplashScreen = ({ children, onShow, onHide }) => (
  <SpringContainer state="showAndHide" onRest={onHide} onStart={onShow}>
    {springs => <div className={cx(styles.splashScreen)} style={springs} >{children}</div >}
  </SpringContainer>
);

SplashScreen.propTypes = {
  children: PropTypes.any,
  onShow: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({
  onShow: () => dispatch(actions.showSplash()),
  onHide: () => dispatch(actions.hideSplash()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SplashScreen);
