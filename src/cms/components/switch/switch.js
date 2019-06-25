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
    this.prevIndex = props.selected;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selected } = this.props;
    this.prevIndex = selected;
  }

  render() {
    const { children, selected } = this.props;

    const childWidth = 100 / children.length;
    const from = {
      left: this.prevIndex * childWidth,
      right: (children.length - 1 - this.prevIndex) * childWidth,
    };
    const to = {
      left: selected * childWidth,
      right: (children.length - 1 - selected) * childWidth,
    };

    const direaction = to.left < from.left ? 'left' : 'right';

    const configFrom = { mass: 1, tension: 400, friction: 36 };
    const configTo = { mass: 2, tension: 400, friction: 36 };
    const Springs = Keyframes.Spring({
      indicate: async (next) => {
        await next({
          from: direaction === 'right' ? { right: `${from.right}%` } : { left: `${from.left}%` },
          to: direaction === 'right' ? { right: `${to.right}%` } : { left: `${to.left}%` },
          config: configFrom,
        });
        await next({
          from: direaction === 'right' ? { left: `${from.left}%` } : { right: `${from.right}%` },
          to: direaction === 'right' ? { left: `${to.left}%` } : { right: `${to.right}%` },
          config: configTo,
        });
      },
    });

    return (
      <Springs state="indicate" >
        {springs => <div className={cx(styles.switch)} >
          <div className={styles.indicator} style={springs} />
          {children}
        </div >}
      </Springs >
    );
  }
}

Switch.propTypes = {
  children: PropTypes.any,
  selected: PropTypes.number.isRequired,
};

Switch.propTypes = {
  selected: 0,
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Switch);
