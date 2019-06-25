import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import noop from 'lodash/noop';
import ReactSelect from 'react-select';
import cx from 'classnames';
import styles from './styles.scss';
import { select } from './types';

class Select extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      inputValue: '',
    };
  }

  getOptionByValue() {
    const { value, options } = this.props;
    return options.find(opt => opt.value === value);
  }

  resolveValue() {
    const { allowMissMatch, value } = this.props;
    if (!value || value === '') return;
    return allowMissMatch ? {
      label: value,
      value: value,
    } : this.getOptionByValue();
  }

  render() {
    const { options, className, placeholder, onChange, onInputChange, isSearchable, isClearable } = this.props;
    const { inputValue } = this.state;
    return (
      <ReactSelect
        options={inputValue !== '' ? [{
          label: inputValue,
          value: inputValue,
        }].concat(options) : options}
        classNamePrefix="select"
        className={cx(styles.select, className)}
        blurInputOnSelect
        value={this.resolveValue()}
        placeholder={placeholder}
        onChange={(opt, action) => {
          const val = opt ? opt.value : '';
          this.setState({ inputValue: '' });
          onChange(val);
        }}
        onBlur={e => {
          const val = e.currentTarget.value;
          this.setState({ inputValue: '' });
          if (val === '') return;
          onChange(val);
        }}
        onInputChange={(val, action) => {
          if (action.action === 'input-change') {
            this.setState({ inputValue: val });
            // if (val === '') return;
            onInputChange(val);
          }
        }}
        isClearable={isClearable}
        isSearchable={isSearchable}
        // onMenuClose={() => {
        //   // todo - remove this before pull request
        //   debugger; // eslint-disable-line
        // }}
      />
    );
  }
}

Select.propTypes = select;

Select.defaultProps = {
  onChange: noop,
  onInputChange: noop,
  allowMissMatch: false,
  options: [],
  isClearable: false,
  isSearchable: true,
};

export default Select;
