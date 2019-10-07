import React, { Fragment, PureComponent } from 'react';
import autoBind from 'auto-bind';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import { hashHistory } from 'react-router';
import PropTypes from 'prop-types';
import { Tooltip } from '/src/shared';
import styles from './styles.scss';

class Button extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      working: false,
      disableClick: false,
    };
    this.willUmnount = false;
    this.onClickDebounced = debounce(this.handleClick, 100, { leading: true, trailing: false });
  }

  componentWillUnmount() {
    this.willUmnount = true;
  }

  handleClick(e) {
    const { onClick, linkTo } = this.props;
    e.stopPropagation();
    if (onClick) {
      const promise = onClick(e);
      if (promise && promise.finally) {
        this.setState({ working: true });
        promise.finally(() => {
          if (!this.willUmnount) {
            this.setState({ working: false });
          }
        });
      }
    }
    if (linkTo) {
      hashHistory.push(linkTo);
    }
  }

  onTouchEnd(e) {
    const { disableClick } = this.state;
    if (disableClick) {
      this.setState({ disableClick: false });
    } else {
      this.onClickDebounced(e);
    }
  }

  disableClick() {
    this.setState({ disableClick: true });
  }

  resolveWaveColor() {
    const { type } = this.props;
    switch (type) {
      case 'white':
      case 'icon':
      case 'transparent':
        return 'wavesDark';
      case 'red':
        return 'wavesRed';
      default:
        return 'wavesLight';
    }
  }

  render() {
    const {
      className, children, disable, tip, tipAnimation, getRef, type, style, tag, justifyContent, domProps,
    } = this.props;
    // const { working } = this.state;
    const Tag = tag;
    return (
      <Tag
        className={cx(
          'ripple',
          'waves-effect',
          styles[this.resolveWaveColor()],
          styles.button,
          className,
          disable && styles.disable,
          [styles[type]],
        )}
        style={Object.assign({
          justifyContent,
        }, style)}
        ref={getRef}
        onClick={this.onClickDebounced}
        onTouchEnd={this.onTouchEnd}
        onTouchMove={this.disableClick}
        {...domProps}
      >
        <Tooltip content={tip} animation={tipAnimation} >
          <div
            className={cx(
              'inner',
              styles.inner,
            )}
          >
            <Fragment >
              {children}
            </Fragment >
          </div >
        </Tooltip >
      </Tag >
    );
  }
}

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClick: PropTypes.func,
  linkTo: PropTypes.string,
  disable: PropTypes.bool,
  tip: PropTypes.node,
  tipAnimation: PropTypes.oneOf(['shift', 'fade', 'scale', 'perspective']),
  getRef: PropTypes.object,
  style: PropTypes.object,
  domProps: PropTypes.object,
  type: PropTypes.oneOf(['icon', 'black', 'white', 'red', 'circle', 'transparent']),
  justifyContent: PropTypes.oneOf(['start', 'center']),
  tag: PropTypes.string.isRequired,
};

Button.defaultProps = {
  disable: false,
  type: 'black',
  tag: 'div',
  justifyContent: 'center',
};

export default Button;
