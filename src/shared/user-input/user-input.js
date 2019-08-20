import React from 'react';
import { connect } from 'react-redux';
import JSON5 from 'json5';
import cx from 'classnames';
import noop from 'lodash/noop';
import { validateEmail, youtubeEmbedTransformer } from '/src/utils';
import Device from '/src/device';
import { Asterisk } from 'styled-icons/fa-solid/Asterisk/Asterisk';
import styles from './styles.scss';
import { userInput } from './types';
import DateTime from './components/date-time/date-time';
import Post from './components/post/post';
import UploadPdf from './components/upload-pdf/upload-pdf';
import UploadImage from './components/upload-image/upload-image';
import SingleLine from './components/single-line/single-line';
import MultiLine from './components/multi-line/multi-line';
import Link from './components/link/link';
import { Switch, SwitchItem } from '../switch';
import MultiSelect from './components/multi-select/multi-select';
import Tooltip from '../tooltip/tooltip';
// import Select from './components/select/select';

const onKeyPress = (e, onEnterKeyPress) => {
  if (e.key === 'Enter') {
    onEnterKeyPress(e);
  }
};

const resolveValidateWith = (validateWith) => {
  switch (validateWith) {
    case 'email':
      return validateEmail;
    default:
      return () => true;
  }
};

const transformValue = (type, value) => {
  switch (true) {
    case type === 'youtube':
      return youtubeEmbedTransformer(value);
    default:
      return value;
  }
};

const resolveComponentByType = (props) => {
  // todo - change optional prop to required instead
  switch (props.type) {
    case 'multi-line':
    case 'multi-line-preserve-lines':
    case 'link':
      return (
        <MultiLine
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          min={props.min}
          max={props.max}
          onValidation={props.onValidation}
          ref={props.getRef}
          validateWith={props.validateWith}
          required={props.required}
          rtl={props.rtl}
          type={props.type}
        />
      );
    case 'date-time':
      return (
        <DateTime
          value={props.value}
          onChange={props.onChange}
          onKeyPress={e => onKeyPress(e, props.onEnterKeyPress)}
          ref={props.getRef}
          validateWith={props.validateWith}
        />);
    case 'date':
      return (
        <DateTime
          value={props.value}
          onChange={props.onChange}
          onKeyPress={e => onKeyPress(e, props.onEnterKeyPress)}
          ref={props.getRef}
          validateWith={props.validateWith}
          hideTime
        />);
    case 'time':
      return (
        <DateTime
          value={props.value}
          onChange={props.onChange}
          onKeyPress={e => onKeyPress(e, props.onEnterKeyPress)}
          ref={props.getRef}
          validateWith={props.validateWith}
          hideDate
        />);
    case 'post':
      return (
        <Post
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onValidation={props.onValidation}
          min={props.min}
          ref={props.getRef}
          validateWith={props.validateWith}
          required={props.required}
        />);
    case 'image':
      return (
        <UploadImage
          value={props.value}
          onChange={props.onChange}
          onValidation={props.onValidation}
          placeholder={props.placeholder}
          ref={props.getRef}
          validateWith={props.validateWith}
          required={props.required}
          transformer={props.transformer}
        />);
    case 'pdf':
      return (
        <UploadPdf
          value={props.value}
          onChange={props.onChange}
          onValidation={props.onValidation}
          placeholder={props.placeholder}
          ref={props.getRef}
          validateWith={props.validateWith}
          required={props.required}
        />);
    case 'youtube':
      return (
        <Link
          placeholder={props.placeholder}
          value={props.value}
          onChange={value => props.onChange(transformValue(props.type, value))}
          onValidation={props.onValidation}
          validateWith={props.validateWith}
          min={props.min}
          ref={props.getRef}
          required={props.required}
        />);
    case 'switch':
      if (props.value === '') {
        props.onChange(props.options[0].value);
        break;
      } else {
        const index = props.options.findIndex(item => item.value === props.value);
        return (
          <Switch indicateIndex={index} className={styles.switch} >
            {props.options.map(item => (
              <SwitchItem key={item.view} onClick={() => props.onChange(item.value)} >{item.view}</SwitchItem >
            ))}
          </Switch >
        );
      }
    // case 'select':
    //   return (
    //     <Select
    //       options={props.options.map(opt => ({
    //         value: opt,
    //         label: toCapitalizedWords(opt),
    //       }))}
    //       value={props.value}
    //       onChange={props.onChange}
    //       className={props.className}
    //       placeholder={props.placeholder}
    //     />
    //   );
    case 'multi-select':
      return (
        <MultiSelect
          options={props.value ? JSON5.parse(props.value) : props.options}
          onChange={props.onChange}
          className={props.className}
        />
      );
    default:
      return (
        <SingleLine
          placeholder={props.placeholder}
          onChange={props.onChange}
          onEnterKeyPress={props.onEnterKeyPress}
          value={props.value}
          min={props.min}
          max={props.max}
          onValidation={props.onValidation}
          mask={props.type === 'password'}
          ref={props.getRef}
          validateWith={resolveValidateWith(props.type, props.validateWith)}
          validationTip={props.validationTip}
          required={props.required}
          onlyNumbers={props.type === 'number'}
          rtl={props.rtl}
          onBlur={props.onBlur}
          autoFocus={props.autoFocus}
        />
      );
  }
};

const composeTip = props => {
  return props._key;
};

const UserInput = props => (
  <div
    className={cx(
      styles.field,
      // props.label && styles.withLabel,
      // props.label && styles[`withLabel-${props.deviceType}`],
      props.className,
      props.disabled && styles.disabled,
      // props.stretch && styles.stretch,
      // (['multi-line', 'post', 'image', 'pdf'].includes(props.type)) && styles.areaField
    )}
    data-label={props.label}
  >
    {props.label && (
      <label className={styles.label} >
        <Tooltip position="top" content={composeTip(props)} >
          {props.label}
          {props.required && <Asterisk className={styles.asterisk} />}
        </Tooltip >
      </label >
    )}
    {resolveComponentByType(props)}
  </div >
);

UserInput.propTypes = userInput;

resolveComponentByType.propTypes = userInput;

UserInput.defaultProps = {
  type: 'single-line',
  onEnterKeyPress: noop,
  disabled: false,
  value: '',
  rtl: false,
  required: false,
};

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
});

export default connect(mapStateToProps, {})(UserInput);
