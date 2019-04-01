import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Device from '/src/device/index';
import autoBind from 'auto-bind';
import { validationIndicator } from '../../types';
import styles from './styles.scss';
import cx from 'classnames';
import { Check } from 'styled-icons/fa-solid/Check';
import { Exclamation } from 'styled-icons/fa-solid/Exclamation';
import Tooltip from '../../../tooltip/tooltip';

class ValidationIndicator extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isValid: false,
      booleanMode: (props.min === 1 && !props.max) || Boolean(props.validateWith),
    };
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate(prevProps) {
    const { value, min, max, validateWith } = this.props;
    if (value !== prevProps.value) {
      this.validate();
    }
    this.setState({ booleanMode: (min === 1 && !max) || Boolean(validateWith) });
  }

  validate() {
    const { value, onValidation, validateWith, numeric } = this.props;
    const isValid = validateWith ? validateWith(value) : numeric ? this.validateNumeric() : this.validateString();
    onValidation(isValid);
    this.setState({ isValid });
  }

  validateString() {
    const { max, min, value } = this.props;
    let isValid = false;
    if (max && min) {
      isValid = value.length <= max && value.length >= min;
    } else if (max) {
      isValid = value.length <= max;
    } else if (min) {
      isValid = value.length >= min;
    }
    return isValid;
  }

  validateNumeric() {
    const { max, min, value } = this.props;
    let isValid = false;
    if (max && min) {
      isValid = value <= max && value >= min;
    } else if (max) {
      isValid = value <= max;
    } else if (min) {
      isValid = value >= min;
    }
    return isValid;
  }

  render() {
    const { min, max, value, show, numeric, rtl } = this.props;
    const { isValid, booleanMode } = this.state;
    let content = '';
    if (booleanMode) {
      content = 'Required Field';
    } else {
      content = min ? `min: ${min}` : '';
      content += max ? ` \\ max: ${max}` : '';
    }
    const charCount = value.length;
    return show ? (
      <Tooltip
        content={content}
        className={cx(styles.validationIndicator, isValid && styles.isValid, rtl && styles.rtl)}
      >
        {isValid ? <Check /> : (booleanMode || numeric) ? <Exclamation /> : charCount}
      </Tooltip >
    ) : null;
  }
}

ValidationIndicator.propTypes = validationIndicator;

ValidationIndicator.defaultProps = {
  show: true,
  value: '',
  rtl: false,
};

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(ValidationIndicator);
