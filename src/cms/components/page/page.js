import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Transition } from 'react-spring/renderprops';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const Page = ({ children, orientation }) => (
  <Transition
    items={[{}]}
    from={{ transform: `translate3d(${orientation === 'next' ? '100%' : '-100%'},0,0)` }}
    enter={{ transform: 'translate3d(0,0,0)' }}
    leave={{ transform: `translate3d(${orientation === 'next' ? '-100%' : '100%'},0,0)` }} >
    {/* eslint-disable-next-line react/display-name */}
    {() => springs => <div className={cx(styles.page)} style={springs} >{children}</div >}
  </Transition >
);

Page.propTypes = {
  children: PropTypes.any,
  orientation: PropTypes.oneOf(['prev', 'next']).isRequired,
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Page);
