import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import noop from 'lodash/noop';
import { toCapitalizedWords } from '/src/cms/utils';
import styles from './styles.scss';
import { userInput } from './types';
import DateTime from './components/date-time/date-time';
import Post from './components/post/post';
import UploadPdf from './components/upload-pdf/upload-pdf';
import UploadImage from './components/upload-image/upload-image';
import SingleLine from './components/single-line/single-line';
import MultiLine from './components/multi-line/multi-line';
import Link from './components/link/link';
import Switch from './components/switch/switch';
import Device from '../../device';
import Select from '../select/select';

const onKeyPress = (e, onEnterKeyPress) => {
  if (e.key === 'Enter') {
    onEnterKeyPress(e);
  }
};

const resolveComponentByType = (props) => {
  switch (props.type) {
    case 'multi-line':
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
          optional={props.optional}
          rtl={props.rtl}
          stretch={props.stretch}
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
          optional={props.optional}
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
          optional={props.optional}
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
          optional={props.optional}
        />);
    case 'link':
    case 'embed':
      return (
        <Link
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onValidation={props.onValidation}
          validateWith={props.validateWith}
          transformer={props.transformer}
          min={props.min}
          ref={props.getRef}
          optional={props.optional}
        />);
    case 'switch':
      return (
        <Switch
          onChange={props.onChange}
          checkedChildren={props.checkedChildren}
          unCheckedChildren={props.unCheckedChildren}
          checked={props.value}
        />);
    case 'select':
      return (
        <Select
          options={props.options.map(opt => ({
            value: opt,
            label: toCapitalizedWords(opt),
          }))}
          value={props.value}
          onChange={props.onChange}
          className={props.className}
          placeholder={props.placeholder}
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
          validateWith={props.validateWith}
          optional={props.optional}
          onlyNumbers={props.type === 'number'}
          rtl={props.rtl}
          stretch={props.stretch}
        />
      );
  }
};

const UserInput = props => (
  <div className={cx(
    styles.field,
    props.label && styles.withLabel,
    props.label && styles[`withLabel-${props.deviceType}`],
    props.className,
    props.disabled && styles.disabled,
    props.stretch && styles.stretch,
    (['multi-line', 'post', 'image', 'pdf'].includes(props.type)) && styles.areaField)}
  >
    {props.label && (
      <label className={styles.label} >
        {props.label}
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
  optional: false,
};

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
});

export default connect(mapStateToProps, {})(UserInput);
