import React from 'react';
import cx from 'classnames';
import { Button } from '/src/cms/shared';
import { Spring } from 'react-spring/renderprops';
import { Check } from 'styled-icons/fa-solid/Check';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import types from '../../types';

const CheckBox = ({ active }) => {
  return (
    <Spring
      from={{ opacity: active ? 0 : 1, transform: active ? 'scale(0)' : 'scale(1)' }}
      to={{ opacity: active ? 1 : 0, transform: active ? 'scale(1)' : 'scale(0)' }} >
      {springs => <div className={cx(styles.checkBox, { [styles.active]: active })} >
        <Check className={styles.checkIcon} style={springs}
        />
      </div >}
    </Spring >
  );
};

CheckBox.propTypes = {
  active: PropTypes.bool.isRequired,
};

CheckBox.defaultProps = {
  active: false,
};

const MultiSelect = ({ options, onChange }) => {
  const handleClick = value => {
    const i = options.findIndex(item => item.value === value);
    options[i].active = !options[i].active;
    return onChange(options);
  };

  return (
    <ul className={styles.multiSelect} >
      {options.map(item => (
        <Button tag="li" key={item.value} onClick={() => handleClick(item.value)} type="transparent" justifyContent="start" >
          <CheckBox active={item.active} />
          {item.view}
        </Button >
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
