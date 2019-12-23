import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import autoBind from 'auto-bind';
import Cleave from 'cleave.js/react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class DateTime extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      date: '',
      month: '',
      year: '',
      hour: '',
      min: '',
      isValid: false,
      initialValueDate: '',
      initialValueTime: '',
    };
  }

  componentDidMount() {
    this.initDateTimeProperties();
  }

  componentDidUpdate(prevProps, prevState) {
    const { onChange, value } = this.props;
    const { date, month, year, hour, min, isValid } = this.state;
    if (!isEqual(this.state, prevState)) {
      if (isValid) {
        const newValue = new Date(year, parseInt(month) - 1, date, hour, min);
        onChange(newValue);
      } else {
        onChange('');
      }
    }

    if (typeof value === 'object' && !isEqual(value, prevProps.value)) {
      this.initDateTimeProperties();
    }
  }

  initDateTimeProperties() {
    const { value } = this.props;

    let date = '';
    let month = '';
    let year = '';
    let hour = '';
    let min = '';

    if (value) {
      const d = value;
      date = d.getDate();
      month = d.getMonth() + 1;
      year = d.getFullYear();
      hour = d.getHours();
      min = d.getMinutes();

      // normalize
      date = date < 10 ? `0${date}` : date;
      month = month < 10 ? `0${month}` : month;
      hour = hour < 10 ? `0${hour}` : hour;
      min = min < 10 ? `0${min}` : min;
    }

    this.setState({
      date,
      month,
      year,
      hour,
      min,
    });
    this.validate(date, month, year, hour, min);
  }

  validate(date, month, year, hour, min) {
    const { hideTime, hideDate } = this.props;
    const isValid = (hideDate ||
      (date.toString().length === 2 && month.toString().length === 2 && year.toString().length === 4)) &&
      (hideTime ||
        (hour.toString().length === 2 && min.toString().length === 2));
    this.setState({ isValid });
  };

  handleDateChange(e) {
    const { hour, min } = this.state;
    const splitValue = e.target.value.split('/');
    const date = splitValue[0];
    const month = splitValue[1];
    const year = splitValue[2];
    this.setState({
      date,
      month,
      year,
      hour,
      min,
      initialValueDate: `${date}${month}${year}`,
    });
    this.validate(date, month, year, hour, min);
  }

  handleTimeChange(e) {
    const { date, month, year } = this.state;
    const hour = e.target.rawValue.substr(0, 2);
    const min = e.target.rawValue.substr(2, 2);
    this.setState({
      date,
      month,
      year,
      hour,
      min,
    });
  }

  // handleClickOutside() { // eslint-disable-line
  //   const { date, month, year, hour, min } = this.state;
  //   const { hideTime, hideDate } = this.props;
  //   if (!hideDate) {
  //     this.dateCleave.setRawValue(`${date}${month}${year}`);
  //   }
  //   if (!hideTime) {
  //     this.timeCleave.setRawValue(`${hour}${min}`);
  //   }
  // }

  // onDateInit(cleave) {
  //   this.dateCleave = cleave;
  // }
  //
  // onTimeInit(cleave) {
  //   this.timeCleave = cleave;
  // }

  render() {
    const { hideTime, hideDate } = this.props;
    const { date, month, year, hour, min, isValid } = this.state;
    return (
      <div className={cx(styles.dateTime, { [styles.inValid]: !isValid })} >
        {!hideDate && (
          <Cleave
            // onInit={this.onDateInit}
            placeholder="DD / MM / YYYY"
            options={{
              date: true,
            }}
            onChange={this.handleDateChange}
            value={`${date}${month}${year}`}
          />
        )}
        {!hideTime && (
          <Cleave
            // onInit={this.onTimeInit}
            placeholder="HH : MM"
            options={{
              time: true,
              timePattern: ['h', 'm'],
            }}
            onChange={this.handleTimeChange}
            value={`${hour}${min}`}
          />
        )}
      </div >
    );
  }
}

DateTime.propTypes = {
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.oneOf([''])]),
  onChange: PropTypes.func.isRequired,
  hideTime: PropTypes.bool,
  hideDate: PropTypes.bool,
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(DateTime);

// todo - support the custom validateWith prop.
