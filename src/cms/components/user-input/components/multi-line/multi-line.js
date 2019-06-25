import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import cx from 'classnames';
import noop from 'lodash/noop';
import styles from './styles.scss';
import { userInput } from '../../types';
import ValidationIndicator from '../validation-indicator/validation-indicator';

class MultiLine extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showValidation: false,
    };
  }

  showValidation() {
    const { optional } = this.props;
    if (optional) return;
    this.setState({ showValidation: true });
  }

  validate(value) {
    const { max, min } = this.props;
    if (max && min) {
      return value.length <= max && value.length >= min;
    } else if (max) {
      return value.length <= max;
    } else if (min) {
      return value.length >= min;
    }
    return true;
  }

  normalizeValue(value) {
    return value.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
  };

  handleOnChange(e) {
    const { onChange } = this.props;
    const newValue = e.target.value;
    onChange(this.normalizeValue(newValue));
  }

  render() {
    const { placeholder, value, max, min, onValidation, validateWith, optional, rtl } = this.props;
    const { showValidation } = this.state;
    return (
      <div className={styles.multiLine} >
        <textarea
          className={cx(
            styles.textArea,
            showValidation && (rtl ? styles.removeLeftBorder : styles.removeRightBorder),
          )}
          placeholder={placeholder}
          value={value}
          onChange={this.handleOnChange}
          onFocus={this.showValidation}
        />
        {!optional && (
          <ValidationIndicator
            show={showValidation}
            min={min}
            max={max}
            onValidation={onValidation}
            value={value}
            validateWith={validateWith}
            rtl={rtl}
          />
        )}
      </div >
    );
  }
}

MultiLine.propTypes = userInput;

MultiLine.defaultProps = {
  onValidation: noop,
  rtl: false
};

export default MultiLine;
