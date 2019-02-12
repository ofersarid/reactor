import React, { PureComponent } from 'react';
import cx from 'classnames';
import autoBind from 'auto-bind';
import enhanceWithClickOutside from 'react-click-outside';
import styles from './styles.scss';
import { content } from './types';

class Content extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleClickOutside() { // eslint-disable-line
    const { handleClickOutside, isOpen } = this.props;
    if (isOpen) {
      handleClickOutside();
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div className={cx('goblins-popover', styles.content)}>{children}</div>
    );
  }
}

Content.propTypes = content;

export default enhanceWithClickOutside(Content);
