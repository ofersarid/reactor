import React, { PureComponent } from 'react';
import cx from 'classnames';
import autoBind from 'auto-bind';
import styles from './styles.scss';
import types from './types';

class CheckBox extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      checked: false,
    };
  }

  handleClick() {
    const { checked } = this.state;
    this.setState({ checked: !checked });
  }

  render() {
    const { checked } = this.state;
    const { children, className } = this.props;
    return (
      <div
        className={cx(
          'ripple',
          styles.checkBox,
          className,
        )}
        onClick={this.handleClick}
      >
        <div className={cx(
          styles.inner,
          checked && styles.checked,
        )}
        >
          {children}
        </div >
      </div >
    );
  }
}

CheckBox.propTypes = types;

export default CheckBox;
