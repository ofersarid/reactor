import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import cx from 'classnames';
import styles from './styles.scss';
import noop from 'lodash/noop';
import { userInput } from '../../types';
import ValidationIndicator from '../validation-indicator/validation-indicator';

const onKeyPress = (e, onEnterKeyPress) => {
  if (e.key === 'Enter') {
    onEnterKeyPress(e);
  }
};

class SingleLine extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showValidation: false,
    };
  }

  normalizeValue(value) {
    const { onlyNumbers } = this.props;
    let normalized = value;

    // remove redundant spaces.
    normalized = normalized.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');

    if (onlyNumbers) {
      normalized = normalized.replace(/\D/g, ''); // if onlyNumbers remove non numeric characters.
      normalized = normalized === '' ? '' : parseInt(normalized);
    }

    return normalized;
  };

  handleOnChange(e) {
    const { onChange } = this.props;
    const newValue = e.target.value;
    onChange(this.normalizeValue(newValue));
  }

  showValidation() {
    const { optional } = this.props;
    if (optional) return;
    this.setState({ showValidation: true });
  }

  hideValidation() {
    this.setState({ showValidation: false });
  }

  render() {
    const {
      placeholder, onEnterKeyPress, value, max, min, onValidation, mask,
      validateWith, onlyNumbers, optional, rtl,
    } = this.props;
    const { showValidation } = this.state;
    return (
      <div className={cx('single-line', styles.singleLine)} >
        <input
          type={mask ? 'password' : 'text'}
          className={cx(
            styles.textInput,
            showValidation && (rtl ? styles.removeLeftBorder : styles.removeRightBorder),
          )}
          placeholder={placeholder}
          onChange={this.handleOnChange}
          onKeyPress={e => onKeyPress(e, onEnterKeyPress)}
          value={value}
          onFocus={this.showValidation}
        />
        {!optional && (
          <ValidationIndicator
            show={showValidation}
            min={min || 1}
            max={max}
            onValidation={onValidation}
            value={value}
            validateWith={validateWith}
            numeric={onlyNumbers}
            rtl={rtl}
          />
        )}
      </div >
    );
  }
}

SingleLine.propTypes = userInput;

SingleLine.defaultProps = {
  onValidation: noop,
  onEnterKeyPress: noop,
  mask: false,
};

export default SingleLine;
