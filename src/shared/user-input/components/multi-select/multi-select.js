import React, { PureComponent } from 'react';
import cx from 'classnames';
import autoBind from 'auto-bind';
import { Button } from '/src/shared';
import { Spring } from 'react-spring/renderprops';
import { Check } from 'styled-icons/fa-solid/Check/Check';
import { Exclamation } from 'styled-icons/fa-solid/Exclamation';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import types from '../../types';

const CheckBox = ({ active, warn }) => {
  return (
    <Spring
      from={{ opacity: active || warn ? 0 : 1, transform: active || warn ? 'scale(0)' : 'scale(1)' }}
      to={{ opacity: active || warn ? 1 : 0, transform: active || warn ? 'scale(1)' : 'scale(0)' }} >
      {springs => <div className={cx(styles.checkBox)} >
        {warn ? (
          <Exclamation className={styles.exclamationIcon} style={springs} />

        ) : (
          <Check className={styles.checkIcon} style={springs} />
        )}
      </div >}
    </Spring >
  );
};

CheckBox.propTypes = {
  active: PropTypes.bool.isRequired,
  warn: PropTypes.bool.isRequired,
};

CheckBox.defaultProps = {
  active: false,
  warn: false,
};

class MultiSelect extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isValid: false,
    };
  }

  componentDidMount() {
    const { validateWith, value } = this.props;
    const isValid = validateWith(value);
    this.setState({ isValid });
  }

  componentDidUpdate() {
    const { validateWith, value } = this.props;
    const isValid = validateWith(value);
    this.setState({ isValid });
  }

  handleClick(value) {
    const { options, onChange } = this.props;
    const i = options.findIndex(item => item.value === value);
    options[i].active = !options[i].active;
    return onChange(options);
  };

  render() {
    const { options } = this.props;
    const { isValid } = this.state;
    return (
      <ul className={styles.multiSelect} >
        {options.map(item => (
          <Button
            tag="li"
            key={item.value}
            onClick={() => this.handleClick(item.value)}
            type="transparent"
            justifyContent="start"
          >
            <CheckBox active={item.active} warn={!isValid} />
            {item.view}
          </Button >
        ))}
      </ul >
    );
  }
}

MultiSelect.propTypes = {
  className: PropTypes.string,
  decorator: PropTypes.func,
  options: types.userInput.options.isRequired,
  onChange: PropTypes.func.isRequired,
  validateWith: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

MultiSelect.defaultProps = {};

export default MultiSelect;
