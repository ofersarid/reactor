import React, { PureComponent } from 'react';
import cx from 'classnames';
import autoBind from 'auto-bind';
import { Button } from '/src/cms/components';
import ReactTinyPopover from 'react-tiny-popover';
import { AngleDown } from 'styled-icons/fa-solid/AngleDown';
import noop from 'lodash/noop';
import styles from './styles.scss';
import { popover } from './types';
import Content from './popover-content';

class Popover extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showPopup: false,
      disableTrigger: false,
    };
  }

  handleClick() {
    const { showPopup, clickedOutside } = this.state;
    if (!showPopup && !clickedOutside) {
      this.setState({
        showPopup: true,
      });
    }
  }

  handleClickOutside() {
    const { showPopup } = this.state;
    if (showPopup) {
      this.setState({
        showPopup: false,
        disableTrigger: true,
      });
    }
    this.timeOut = setTimeout(() => {
      this.setState({ disableTrigger: false });
    }, 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }

  render() {
    const { showPopup, disableTrigger } = this.state;
    const { children, position, content, dropMenu } = this.props;
    return (
      <ReactTinyPopover
        isOpen={showPopup}
        position={position}
        content={({ position, targetRect, popoverRect }) => ( // eslint-disable-line
          <Content handleClickOutside={this.handleClickOutside} isOpen={showPopup} >{content}</Content>
        )}
      >
        <Button onClick={disableTrigger ? noop : this.handleClick} >
          {children}
          {dropMenu && <AngleDown className={cx(styles.dropIcon, showPopup && styles.flip)}/>}
        </Button >
      </ReactTinyPopover >
    );
  }
}

Popover.propTypes = popover;

Popover.defaultProps = {
  position: 'bottom',
  content: 'Demo Content',
  dropMenu: false,
};

export default Popover;
