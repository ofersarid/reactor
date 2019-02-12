import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import Cleave from 'cleave.js/react';
import enhanceWithClickOutside from 'react-click-outside';
import isEqual from 'lodash/isEqual';
import types from './types';
import styles from '../../styles.scss';

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
    };
  }

  componentDidMount() {
    this.initDateTimeProperties();
  }

  componentDidUpdate(prevProps, prevState) {
    const { onChange, value } = this.props;
    const { date, month, year, hour, min } = this.state;
    if (!isEqual(this.state, prevState)) {
      onChange(new Date(year, parseInt(month) - 1, date, hour, min));
    }

    if (!isEqual(value, prevProps.value)) {
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
      const d = new Date(value);
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
  }

  validate(date, month, year, hour, min) {
    return date.toString().length === 2 &&
      month.toString().length === 2 &&
      year.toString().length === 4 &&
      hour.toString().length === 2 &&
      min.toString().length === 2;
  };

  handleDateChange(e) {
    const { hour, min } = this.state;
    const date = e.target.rawValue.substr(0, 2);
    const month = e.target.rawValue.substr(2, 2);
    const year = e.target.rawValue.substr(4, 4);
    if (this.validate(date, month, year, hour, min)) {
      this.setState({
        date,
        month,
        year,
        hour,
        min,
      });
    }
  }

  handleTimeChange(e) {
    const { date, month, year } = this.state;
    const hour = e.target.rawValue.substr(0, 2);
    const min = e.target.rawValue.substr(2, 2);
    if (this.validate(date, month, year, hour, min)) {
      this.setState({
        date,
        month,
        year,
        hour,
        min,
      });
    }
  }

  handleClickOutside() { // eslint-disable-line
    const { date, month, year, hour, min } = this.state;
    this.dateCleave.setRawValue(`${date}${month}${year}`);
    this.timeCleave.setRawValue(`${hour}${min}`);
  }

  onDateInit(cleave) {
    this.dateCleave = cleave;
  }

  onTimeInit(cleave) {
    this.timeCleave = cleave;
  }

  render() {
    const { onKeyPress } = this.props;
    const { date, month, year, hour, min } = this.state;
    return (
      <div className={styles.dateTime} >
        <Cleave
          onInit={this.onDateInit}
          placeholder="DD / MM / YYYY"
          options={{
            date: true,
          }}
          onChange={this.handleDateChange}
          onFocus={e => {
            // this.dateCleave.setRawValue();
          }}
          value={`${date}${month}${year}`}
          onKeyPress={onKeyPress}
        />
        <Cleave
          onInit={this.onTimeInit}
          placeholder="HH : MM"
          options={{
            time: true,
            timePattern: ['h', 'm'],
          }}
          onChange={this.handleTimeChange}
          value={`${hour}${min}`}
          onKeyPress={onKeyPress}
        />
      </div >
    );
  }
}

DateTime.propTypes = types;

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(enhanceWithClickOutside(DateTime));

// todo - support the custom validateWith prop.
