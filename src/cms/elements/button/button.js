import React, { Fragment, PureComponent } from 'react';
import autoBind from 'auto-bind';
import cx from 'classnames';
import { hashHistory } from 'react-router';
import Puff from '/src/cms/svg-loaders/puff.svg';
import Tooltip from '/src/cms/elements/tooltip/tooltip';
import { store } from '/src';
import styles from './styles.scss';
import { button } from './types';

const colors = [
  'green',
  'black',
  'black-invert',
  'white',
  'red',
  'yellow'
];

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
      className, textColor, color, children, disable, stretch, tip, maxWidth,
      noAnimation, justIcon, interactive, tipAnimation, getRef, noScale,
    } = this.props;
    const { working } = this.state;
    return (
      <Tooltip content={tip} interactive={interactive} store={store} animation={tipAnimation} >
        <div
          className={cx(
            'ripple',
            'waves-effect',
            (colors.includes(color) || noScale) && styles.noScale,
            color ? styles.wavesDark : styles.wavesLight,
            styles.button,
            className,
            disable && styles.disable,
            stretch && styles.stretch,
            noAnimation && styles.noAnimation,
          )}
          style={{
            maxWidth,
          }}
          ref={getRef}
          onClick={this.handleClick}
        >
          {working && <img className={styles.activityIndicator} src={Puff} />}
          <div
            className={cx(
              'inner',
              styles.inner,
              colors.includes(textColor) && styles[`text-${textColor}`],
              colors.includes(color) && styles[color],
              working && styles.hideChildren,
              justIcon && styles.justIcon,
            )}
            style={{
              backgroundColor: !colors.includes(color) ? color : undefined,
              color: !colors.includes(textColor) ? textColor : undefined,
            }}
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
  textColor: null,
  disable: false,
  stretch: false,
  justIcon: false,
  interactive: false,
};

export default Button;
