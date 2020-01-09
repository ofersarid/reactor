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
      isValid: false,
    };
  }

  componentDidMount() {
    const { validateWith, value } = this.props;
    this.setState({ isValid: validateWith(value) });
  }

  componentDidUpdate(prevProps) {
    const { validateWith, value } = this.props;
    this.setState({ isValid: validateWith(value) });
  }

  render() {
    const { options, className, placeholder, onChange, isSearchable, isClearable, value } = this.props;
    const { isValid } = this.state;
    const optionsTransformed = options.map(opt => {
      if (typeof opt === 'object') {
        // deprecated
        return ({
          value: opt.value,
          label: opt.view,
        });
      } else {
        // use this
        return ({
          value: opt,
          label: opt,
        });
      }
    });
    return (
      <ReactSelect
        className={cx(styles.select, className, { [styles.error]: !isValid })}
        classNamePrefix="select"
        isClearable={isClearable}
        isSearchable={isSearchable}
        options={optionsTransformed}
        blurInputOnSelect
        defaultValue={value ? {
          label: value,
          value: value,
        } : undefined}
        // value={inputValue}
        placeholder={placeholder}
        onChange={(opt, action) => {
          const val = opt ? opt.value : '';
          onChange(val);
        }}
        // onBlur={e => {
        //   // todo - remove this before pull request
        //   debugger; // eslint-disable-line
        //   const val = e.currentTarget.value;
        //   this.setState({ inputValue: '' });
        //   if (val === '') return;
        //   onChange(val);
        // }}
        // onInputChange={(val, action) => {
        //   if (action.action === 'input-change') {
        //     this.setState({ inputValue: val });
        //     // if (val === '') return;
        //     onInputChange(val);
        //   }
        // }}
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
  allowMissMatch: false,
  options: [],
  isClearable: false,
  isSearchable: true,
};

export default Select;
