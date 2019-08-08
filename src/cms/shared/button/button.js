import React, { Fragment, PureComponent } from 'react';
import autoBind from 'auto-bind';
import cx from 'classnames';
import { hashHistory } from 'react-router';
import { Tooltip } from '/src/cms/shared';
import styles from './styles.scss';
import PropTypes from 'prop-types';
import { tipAnimations } from '../tooltip/types';

class Button extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      working: false,
    };
    this.willUmnount = false;
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

  resolveWaveColor() {
    const { type } = this.props;
    switch (type) {
      case 'white':
      case 'icon':
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
        onClick={this.handleClick}
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
  tipAnimation: PropTypes.oneOf(tipAnimations),
  getRef: PropTypes.object,
  style: PropTypes.object,
  domProps: PropTypes.object,
  type: PropTypes.oneOf(['icon', 'black', 'white', 'red', 'circle']),
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
