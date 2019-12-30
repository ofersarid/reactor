import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import autoBind from 'auto-bind';
import { actionTypes } from 'redux-firestore';
import { Transition, animated } from 'react-spring/renderprops';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { LogOutCircle } from 'styled-icons/boxicons-regular/LogOutCircle/LogOutCircle';
import { ChevronLeft } from 'styled-icons/fa-solid/ChevronLeft/ChevronLeft';
import { Button } from '/src/shared';
import services from '/src/services';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class NavBar extends React.PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  goBack() {
    const { goBackPath } = this.props;
    hashHistory.push(goBackPath);
  }

  logOut() {
    const { logOut, clearData } = this.props;
    logOut();
    clearData();
  }

  render() {
    const { uid, pathname, appTitle, show } = this.props;

    return (
      <div className={cx(styles.navBar, { [styles.show]: show })} >
        <Transition
          unique
          items={0}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }} >
          {() => springs => <animated.div
            className={cx(styles.navBarTitle)}
            style={springs} >
            {appTitle || '...'}
          </animated.div >}
        </Transition >
        {(uid && pathname === '/cms/home') && (
          <Transition
            unique
            items={0}
            from={{ opacity: 0, transform: 'scale(0)' }}
            enter={{ opacity: 1, transform: 'scale(1)' }}
            leave={{ opacity: 0, transform: 'scale(0)' }} >
            {() => springs => <animated.div className={cx(styles.toTheLeft, styles.btnWrap)} style={springs} >
              <Button type="icon" className={cx(styles.btn)} onClick={this.logOut} >
                <LogOutCircle />
              </Button >
            </animated.div >}
          </Transition >
        )}
        {(uid && pathname !== '/cms/home' && pathname !== '/cms/login') && (
          <Transition
            unique
            items={0}
            from={{ opacity: 0, transform: 'scale(0)' }}
            enter={{ opacity: 1, transform: 'scale(1)' }}
            leave={{ opacity: 0, transform: 'scale(0)' }} >
            {() => springs => <animated.div className={cx(styles.toTheLeft, styles.btnWrap)} style={springs} >
              <Button type="icon" className={cx(styles.btn)} onClick={this.goBack} >
                <ChevronLeft />
              </Button >
            </animated.div >}
          </Transition >
        )}
      </div >
    );
  }
}

NavBar.propTypes = {
  logOut: PropTypes.func.isRequired,
  uid: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  appTitle: PropTypes.string,
  goBackPath: PropTypes.string.isRequired,
  show: PropTypes.bool,
  clearData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  uid: services.auth.selectors.uid(state),
  pathname: services.router.selectors.pathname(state),
  goBackPath: services.router.selectors.goBackPath(state),
  appTitle: services.app.selectors.headerTitle(state),
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(services.auth.actions.logOut()),
  clearData: () => dispatch({
    type: actionTypes.CLEAR_DATA,
  }),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NavBar);
