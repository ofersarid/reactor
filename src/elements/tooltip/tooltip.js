import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import autoBind from 'auto-bind';
import { Tooltip as Tippy } from 'react-tippy';
import Routes from '/src/routes/index';
import styles from './styles.scss';
import types from './types';
import Device from '../../device/index';

class Tooltip extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const { children, content, className, interactive, animation, position, isMobile } = this.props;
    return content ? (
      <Tippy
        className={cx(className)}
        sticky
        tabIndex={null}
        html={<div className={styles.content} >{content}</div >}
        animateFill={false}
        arrow={true}
        delay={[interactive ? 0 : 500, 0]}
        animation={animation}
        position={position}
        interactive={interactive}
        touchHold={isMobile}
        trigger={interactive ? 'click' : 'mouseenter'}
        style={{
          display: 'inherit',
        }}
      >
        {children}
      </Tippy >
    ) : children;
  }
}

Tooltip.propTypes = types;

Tooltip.defaultProps = {
  position: 'top',
  interactive: false,
  animation: 'shift',
};

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  pathname: Routes.selectors.pathname(state),
});

export default connect(mapStateToProps, {})(Tooltip);
