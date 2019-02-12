import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import cx from 'classnames';
import Device from '/src/cms/device';
import noop from 'lodash/noop';
import types from './types';
import styles from './styles.scss';

const $body = document.getElementsByTagName('body')[0];

const Toaster = props => ReactDOM.createPortal(
  <div
    className={cx(props.onClick && `ripple waves-effect ${styles.button}`, styles.toaster, props.show && styles.show, styles[props.type])}
    onClick={props.onClick ? props.onClick : noop}
  >
    {props.children}
  </div >,
  $body,
);

Toaster.propTypes = types;

Toaster.defaultProps = {
  show: false,
  type: 'error',
};

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(Toaster);
