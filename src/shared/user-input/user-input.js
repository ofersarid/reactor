import React from 'react';
import JSON5 from 'json5';
import cx from 'classnames';
import noop from 'lodash/noop';
import { youtubeEmbedTransformer } from '/src/utils';
import { Asterisk } from 'styled-icons/fa-solid/Asterisk/Asterisk';
import styles from './styles.scss';
import { userInput } from './types';
import DateTime from './components/date-time/date-time';
import Post from './components/post/post';
import UploadPdf from './components/upload-pdf/upload-pdf';
import UploadAudio from './components/upload-audio/upload-audio';
import UploadImage from './components/upload-image/upload-image';
import SingleLine from './components/single-line/single-line';
import MultiLine from './components/multi-line/multi-line';
import { Switch } from '../switch';
import MultiSelect from './components/multi-select/multi-select';
import Select from './components/select/select';
import Tooltip from '../tooltip/tooltip';

const onKeyPress = (e, onEnterKeyPress) => {
  if (e.key === 'Enter') {
    onEnterKeyPress(e);
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
    case 'youtube':
    case 'email':
      return (
        <MultiLine
          {...props}
          onChange={value => props.onChange(transformValue(props.type, value))}
          ref={props.getRef}
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
    case 'rich':
      return (
        <Post
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onValidation={props.onValidation}
          min={props.min}
          max={props.max}
          ref={props.getRef}
          validateWith={props.validateWith}
          required={props.required}
        />);
    case 'image':
      return (
        <UploadImage
          {...props}
          ref={props.getRef}
        />);
    case 'pdf':
      return (
        <UploadPdf
          {...props}
          ref={props.getRef}
        />);
    case 'audio':
      return (
        <UploadAudio {...props} />);
    case 'switch':
      if (props.value === '') {
        const firstOption = props.options[0];
        props.onChange(firstOption.value || firstOption);
        break;
      } else {
        const index = props.options.findIndex(item => (
          (typeof item === 'string' ? item : item.value.toString()) ===
          (typeof props.value === 'string' ? props.value : (props.value.value === undefined ? props.value.toString() : props.value.value.toString()))
        ));
        return (
          <Switch
            indicateIndex={index}
            className={styles.switch}
            onChange={props.onChange}
            options={props.options}
          />
        );
      }
    case 'multi-select':
      return (
        <MultiSelect
          options={props.value ? JSON5.parse(props.value) : props.options}
          onChange={props.onChange}
          className={props.className}
          value={props.value}
          validateWith={props.validateWith}
        />
      );
    case 'select':
      return (
        <Select {...props} />
      );
    case 'number':
    default:
      return (
        <SingleLine
          {...props}
          onValidation={props.onValidation}
          mask={props.type === 'password'}
          ref={props.getRef}
          onlyNumbers={props.type === 'number'}
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
      props.className,
      props.disabled && styles.disabled,
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

resolveComponentByType.propTypes = UserInput.propTypes;

UserInput.defaultProps = {
  type: 'single-line',
  onEnterKeyPress: noop,
  disabled: false,
  value: '',
  rtl: false,
  required: false,
};

export default UserInput;
