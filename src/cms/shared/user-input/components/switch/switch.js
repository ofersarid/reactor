import React, { PureComponent } from 'react';
import RcSwitch from 'rc-switch';
import 'rc-switch/assets/index.css';
import autoBind from 'auto-bind';
import cx from 'classnames';
import { switchTypes } from '../../types';
import styles from './styles.scss';

class Switch extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  onChange(checked) {
    const { onChange } = this.props;
    onChange(checked);
  };

  render() {
    const { checked } = this.props;
    return (
      <RcSwitch
        className={cx(styles.switch, checked && styles.isActive)}
        onChange={this.onChange}
        checkedChildren="on"
        unCheckedChildren={<span className={styles.off}>off</span>}
        checked={checked}
      />
    );
  }
}

Switch.propTypes = switchTypes;

export default Switch;
