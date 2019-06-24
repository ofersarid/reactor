import React, { Fragment, PureComponent } from 'react';
import autoBind from 'auto-bind';
import cx from 'classnames';
import { hashHistory } from 'react-router';
import Tooltip from '/src/elements/tooltip/tooltip';
import { store } from '/src/index';
import styles from './styles.scss';
import { button } from './types';

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

  render() {
    const {
      className, children, disable, tip, maxWidth,
      interactive, tipAnimation, getRef
    } = this.props;
    // const { working } = this.state;
    return (
      <Tooltip content={tip} interactive={interactive} store={store} animation={tipAnimation} >
        <div
          className={cx(
            'ripple',
            'waves-effect',
            styles.wavesLight,
            styles.button,
            className,
            disable && styles.disable,
          )}
          style={{
            maxWidth,
          }}
          ref={getRef}
          onClick={this.handleClick}
        >
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
        </div >
      </Tooltip >
    );
  }
}

Button.propTypes = button;

Button.defaultProps = {
  disable: false,
};

export default Button;
