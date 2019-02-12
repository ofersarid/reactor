import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import cx from 'classnames';
import styles from './styles.scss';
import noop from 'lodash/noop';
import Button from '/src/cms/elements/button';
import { validateEmail } from '/src/cms/utils';
import { ExternalLinkSquareAlt } from 'styled-icons/fa-solid/ExternalLinkSquareAlt';
import { link } from '../../types';
import ValidationIndicator from '../validation-indicator/validation-indicator';

const onKeyPress = (e, onEnterKeyPress) => {
  if (e.key === 'Enter') {
    onEnterKeyPress(e);
  }
};

class Link extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showValidation: false,
      isValid: props.optional,
    };
  }

  handleOnChange(e) {
    const { onChange, transformer } = this.props;
    const newValue = e.target.value;
    onChange(transformer(newValue));
  }

  showValidation() {
    const { optional } = this.props;
    if (optional) return;
    this.setState({ showValidation: true });
  }

  onValidation(isValid) {
    const { onValidation } = this.props;
    onValidation(isValid);
    this.setState({ isValid });
  }

  render() {
    const { placeholder, onEnterKeyPress, value, max, min, validateWith, optional, rtl } = this.props;
    const { showValidation } = this.state;
    const isEmail = validateEmail(value);
    return (
      <div className={cx(styles.singleLine, styles.link)} >
        <input
          type="text"
          className={cx(styles.textInput, (showValidation || value.length > 0) && styles.removeRightBorder)}
          placeholder={placeholder}
          onChange={this.handleOnChange}
          onKeyPress={e => onKeyPress(e, onEnterKeyPress)}
          value={value}
          onFocus={this.showValidation}
        />
        {value.length > 0 && (
          <Button
            onClick={() => window.open(isEmail ? `mailto:${value}` : value, '_blank')}
            color="yellow"
            tip="Test Link"
            className={styles.testLinkButton}
          >
            <ExternalLinkSquareAlt />
          </Button >
        )}
        {!optional && (
          <ValidationIndicator
            show={showValidation}
            min={min}
            max={max}
            onValidation={this.onValidation}
            value={value}
            validateWith={validateWith}
            rtl={rtl}
          />
        )}
      </div >
    );
  }
}

Link.propTypes = link;

Link.defaultProps = {
  rtl: false,
};

Link.defaultProps = {
  onValidation: noop,
  transformer: value => value,
};

export default Link;
