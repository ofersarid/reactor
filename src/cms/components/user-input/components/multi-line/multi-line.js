// todo - remove eslint disable
/* eslint-disable */
import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import cx from 'classnames';
import noop from 'lodash/noop';
import Textarea from 'react-textarea-autosize';
import styles from './styles.scss';
import { userInput } from '../../types';
import ValidationIndicator from '../validation-indicator/validation-indicator';

class MultiLine extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isValid: true,
    };
  }

  componentDidMount() {
    const { validateWith, value } = this.props;
    this.setState({ isValid: validateWith(value) });
  }

  normalizeValue(value) {
    return value.replace(/^\s+/, '').replace(/\s{2,}|(?:\r|\n|\r\n)/g, ' ');
  };

  handleOnChange(e) {
    const { onChange, validateWith } = this.props;
    const newValue = this.normalizeValue(e.target.value);
    onChange(newValue);
    this.setState({ isValid: validateWith(newValue) });
  }

  render() {
    const { placeholder, value, max, min, onValidation, validateWith, required, rtl } = this.props;
    const { isValid } = this.state;
    return (
      <div className={styles.multiLine} >
        <div className={cx(styles.textArea)} >
          <Textarea
            placeholder={placeholder}
            value={value}
            onChange={this.handleOnChange}
          />
        </div >
        <div className={cx(styles.tip, { [styles.notValid]: !isValid })} >
          (<span className={styles.number} >{value.length}</span >/<span className={styles.number} >{max}</span >)
        </div >
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
