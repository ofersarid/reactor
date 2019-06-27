import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { Transition, animated } from 'react-spring/renderprops';
import { connect } from 'react-redux';
import { LogOutCircle } from 'styled-icons/boxicons-regular/LogOutCircle';
import { Button } from '/src/cms/components';
import Routes from '/src/routes';
import Auth from '/src/cms/components/auth';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class NavBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.titles = [springs => <animated.div className={cx(styles.navBarTitle)} style={springs} >REACTOR</animated.div >];
    props.pages.forEach(p => {
      this.titles.push(springs => <animated.div className={cx(styles.navBarTitle)} style={springs} >{p.name}</animated.div >);
    });
  }

  resolvePageIndex(path) {
    switch (true) {
      case path === '/cms/login':
      case path === '/cms/home':
        return 0;
      case path.includes('/cms/editor'):
        return 1;
      default:
        return 0;
    }
  };

  render() {
    const { logOut, uid, pathname, prevPath } = this.props;
    const pageIndex = this.resolvePageIndex(pathname);
    const pageIndexPrev = this.resolvePageIndex(prevPath);
    const direction = pageIndex > pageIndexPrev ? 'right' : 'left';

    return (
      <div className={cx(styles.navBar)} >
        <Transition
          native
          reset
          unique
          items={pageIndex}
          from={{ transform: `translateX(${direction === 'right' ? '0%' : '-100%'})`, opacity: 0 }}
          enter={{ transform: 'translateX(-50%)', opacity: 1 }}
          leave={{ transform: `translateX(${direction === 'right' ? '-100%' : '0%'})`, opacity: 0 }} >
          {index => this.titles[index]}
        </Transition >
        {uid && pathname === '/cms/home' && (
          <Button type="icon" className={cx(styles.toTheLeft, styles.btn)} onClick={logOut} >
            <LogOutCircle />
          </Button >
        )}
      </div >
    );
  }
}

NavBar.propTypes = {
  logOut: PropTypes.func.isRequired,
  uid: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  prevPath: PropTypes.string.isRequired,
  pages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({
  uid: Auth.selectors.uid(state),
  pathname: Routes.selectors.pathname(state),
  prevPath: Routes.selectors.prevPath(state),
  pages: [{
    name: 'FRAME',
    id: '3',
  }],
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(Auth.actions.logOut()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NavBar);
