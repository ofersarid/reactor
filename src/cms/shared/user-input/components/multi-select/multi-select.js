import React from 'react';
import cx from 'classnames';
import { Spring } from 'react-spring/renderprops';
import { Check } from 'styled-icons/fa-solid/Check';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import types from '../../types';

const CheckBox = ({ active }) => {
  return (
    <Spring
      from={{ opacity: active ? 0 : 1 }}
      to={{ opacity: active ? 1 : 0 }} >
      {springs => <div className={cx(styles.checkBox, { active })} >
        <Check className={styles.checkIcon} styles={{
          opacity: springs.opacity,
        }}
        />
      </div >}
    </Spring >
  );
};

CheckBox.propTypes = {
  active: PropTypes.bool.isRequired,
};

const MultiSelect = ({ options }) => {
  return (
    <ul className={styles.multiSelect} >
      {options.map(item => (
        <li key={item.value} >
          <CheckBox active={item.active} />
          {item.view}
        </li >
      ))}
    </ul >
  );
};

MultiSelect.propTypes = {
  className: PropTypes.string,
  decorator: PropTypes.func,
  options: types.userInput.options.isRequired,
  onChange: PropTypes.func.isRequired,
};

MultiSelect.defaultProps = {};

export default MultiSelect;
