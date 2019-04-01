// @flow

import React, { Component } from 'react';
import InputRange from 'react-input-range';
import cx from 'classnames';
import styles from './styles.scss';
import { range } from './types';

class Range extends Component {
  render() {
    const { min, max, step, value, onChange } = this.props;
    return (
      <div className={cx('gob-range', styles.gobRange, !min && styles.hideMinValue)} >
        <InputRange
          maxValue={max}
          minValue={min}
          value={value}
          onChange={onChange}
          step={step}
        />
      </div >
    );
  }
}

Range.propTypes = range;

Range.defaultProps = {
  step: 1,
  min: 0,
};

export default Range;
