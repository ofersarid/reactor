import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import services from '/src/services';
import cx from 'classnames';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import { Tooltip as Tippy } from 'react-tippy';
import styles from './styles.scss';

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

Tooltip.propTypes = {
  children: PropTypes.any,
  position: PropTypes.oneOf(['top', 'right', 'left', 'bottom']),
  content: PropTypes.node,
  className: PropTypes.string,
  interactive: PropTypes.bool,
  isMobile: PropTypes.bool,
  animation: PropTypes.oneOf(['shift', 'fade', 'scale', 'perspective']),
  store: PropTypes.any,
};

Tooltip.defaultProps = {
  position: 'top',
  interactive: false,
  animation: 'shift',
};

const mapStateToProps = state => ({
  isMobile: services.device.selectors.type(state) === 'mobile',
});

export default connect(mapStateToProps, {})(Tooltip);
