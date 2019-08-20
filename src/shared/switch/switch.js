import React, { PureComponent } from 'react';
import cx from 'classnames';
import { Keyframes } from 'react-spring/renderprops';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Switch extends PureComponent {
  constructor(props) {
    super(props);
    this.prevIndex = 0;
  }

  componentDidMount() {
    const { indicateIndex } = this.props;
    this.prevIndex = indicateIndex;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { indicateIndex } = this.props;
    this.prevIndex = indicateIndex;
  }

  render() {
    const { children, indicateIndex, className } = this.props;

    const childWidth = 100 / children.length;
    const from = {
      left: this.prevIndex * childWidth,
      right: (this.prevIndex + 1) * childWidth,
    };
    const to = {
      left: indicateIndex * childWidth,
      right: (indicateIndex + 1) * childWidth,
    };

    const direction = to.left < from.left ? 'left' : 'right';

    const configFrom = { mass: 1, tension: 400, friction: 36 };
    const configTo = { mass: 2, tension: 400, friction: 36 };
    const Springs = Keyframes.Spring({
      indicate: async (next) => {
        await next({
          from: direction === 'right' ? { right: `${100 - from.right}%`, left: `${from.left}%` } : { left: `${from.left}%`, right: `${100 - from.right}%` },
          to: direction === 'right' ? { right: `${100 - to.right}%`, left: `${from.left}%` } : { left: `${to.left}%`, right: `${100 - from.right}%` },
          config: configFrom,
        });
        await next({
          from: direction === 'right' ? { left: `${from.left}%` } : { right: `${100 - from.right}%` },
          to: direction === 'right' ? { left: `${to.left}%` } : { right: `${100 - to.right}%` },
          config: configTo,
        });
      },
    });

    return (
      <Springs state="indicate" >
        {springs => <div className={cx(styles.switch, className)} >
          <div className={styles.indicator} style={springs} />
          {children}
        </div >}
      </Springs >
    );
  }
}

Switch.propTypes = {
  children: PropTypes.any,
  indicateIndex: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Switch.defaultProps = {
  indicateIndex: 0,
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Switch);
