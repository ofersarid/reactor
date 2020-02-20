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
      wasBlured: false,
      isFocused: false,
      isValid: false,
    };
    this.$input = React.createRef();
  }

  componentDidMount() {
    const { focus, value } = this.props;
    if (focus) {
      setTimeout(() => {
        this.$input.current.focus();
      }, 1000);
    }

    this.validate(value);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { focus } = this.props;
    const { wasBlured } = this.state;
    if (focus && !prevProps.focus && !wasBlured) {
      this.$input.current.focus();
    }
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
    const val = this.normalizeValue(newValue);
    onChange(val);
    this.validate(val);
  }

  validate(val) {
    const { validateWith } = this.props;
    this.setState({
      isValid: validateWith(val)
    });
  }

  showValidation() {
    const { optional } = this.props;
    if (optional) return;
    this.setState({ showValidation: true });
  }

  hideValidation() {
    this.setState({ showValidation: false });
  }

  onBlur() {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
    this.setState({ hasBlured: true });
  }

  onFocus() {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus();
    }
    this.setState({ isFocused: true });
  }

  render() {
    const { placeholder, onEnterKeyPress, value, mask } = this.props;
    const { isValid } = this.state;
    return (
      <form className={cx('single-line', styles.singleLine)} >
        <input
          type={mask ? 'password' : 'text'}
          className={cx(
            styles.textInput,
          )}
          placeholder={placeholder}
          onChange={this.handleOnChange}
          onKeyPress={e => {
            this.showValidation();
            onKeyPress(e, onEnterKeyPress);
          }}
          value={value}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          ref={this.$input}
        />
        <ValidationIndicator status={value.length === 0 ? 'standBy' : isValid ? 'valid' : 'error'}/>
      </form >
    );
  }
}

SingleLine.propTypes = userInput;

SingleLine.defaultProps = {
  onValidation: noop,
  onEnterKeyPress: noop,
  mask: false,
  onBlur: noop,
};

export default SingleLine;
