import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ReactSVG } from 'react-svg';
import bullet from '/src/assets/images/bullet.svg';
import styles from './styles.scss';

const ValidationIndicator = ({ status }) => {
  return (
    <ReactSVG src={bullet} className={cx(styles.bullet, styles[status])} />
  );
};

ValidationIndicator.propTypes = {
  status: PropTypes.oneOf(['valid', 'error', 'standBy']),
};

export default ValidationIndicator;
