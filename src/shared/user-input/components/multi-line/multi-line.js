import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import cx from 'classnames';
import noop from 'lodash/noop';
import Textarea from 'react-textarea-autosize';
import styles from './styles.scss';
import { userInput } from '../../types';

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

  componentDidUpdate() {
    const { validateWith, value } = this.props;
    this.setState({ isValid: validateWith(value) });
  }

  normalizeValue(value) {
    const { type } = this.props;
    let normalizedVal;
    normalizedVal = value.replace(/^\s+/, ''); //  remove pre text white space
    normalizedVal = normalizedVal.replace(/\s{2,}/g, ' '); // remove extra white space inside text
    if (type !== 'multi-line-preserve-lines') {
      normalizedVal = normalizedVal.replace(/(?:\r|\n|\r\n)/g, ' ');
    }
    return normalizedVal;
  };

  handleOnChange(e) {
    const { onChange, validateWith, required } = this.props;
    const newValue = this.normalizeValue(e.target.value);
    onChange(newValue);
    this.setState({ isValid: validateWith(newValue) || (!required && newValue.length === 0) });
  }

  render() {
    const { placeholder, value, max, type } = this.props;
    const { isValid } = this.state;
    return (
      <div className={styles.multiLine} >
        <div className={cx(styles.textArea)} >
          <Textarea
            placeholder={placeholder}
            value={value}
            onChange={this.handleOnChange}
            style={{
              borderBottomColor: isValid ? 'black' : 'red',
            }}
          />
        </div >
        {!['link', 'email'].includes(type) && (
          <div className={cx(styles.tip, { [styles.notValid]: !isValid })} >
            ({value.length}/{max})
          </div >
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
