import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import autoBind from 'auto-bind';
import { Transition, animated } from 'react-spring/renderprops';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { LogOutCircle } from 'styled-icons/boxicons-regular/LogOutCircle';
import { ChevronLeft } from 'styled-icons/fa-solid/ChevronLeft';
import { Button } from '/src/cms/components';
import Routes from '/src/routes';
import Auth from '/src/cms/components/auth';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class NavBar extends React.PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    // this.titles = [springs => <animated.div
    //   className={cx(styles.navBarTitle)}
    //   style={springs} >
    //   REACTOR
    // </animated.div >];
    //
    // props.pages.forEach(item => {
    //   this.titles.push(springs => <animated.div
    //     className={cx(styles.navBarTitle)}
    //     style={springs} >
    //     {item.name}
    //   </animated.div >);
    // });
    //
    // props.collections.forEach(item => {
    //   this.titles.push(springs => <animated.div
    //     className={cx(styles.navBarTitle)}
    //     style={springs} >
    //     {item.name}
    //   </animated.div >);
    // });
  }

  // resolvePageIndex(path) {
  //   const { assetId, collectionId, pages, collections } = this.props;
  //   switch (true) {
  //     case path === '/cms/login':
  //     case path === '/cms/home':
  //       return 0;
  //     case path.includes('/cms/editor'):
  //       const collection = collections.find(item => item.id === collectionId);
  //       const titleProp = collection.layout.title;
  //
  //       return 1;
  //     default:
  //       return 0;
  //   }
  // };

  goBack() {
    const { goBackPath } = this.props;
    hashHistory.push(goBackPath);
  }

  render() {
    const { logOut, uid, pathname, appTitle } = this.props;
    // const pageIndex = this.resolvePageIndex(pathname);
    // const pageIndexPrev = this.resolvePageIndex(prevPath);
    // const direction = pageIndex > pageIndexPrev ? 'right' : 'left';

    // const titleSprings = {
    //   from: { opacity: 0 },
    //   enter: { opacity: 1 },
    //   leave: { opacity: 0 },
    // };

    return (
      <div className={cx(styles.navBar)} >
        {/* <Transition */}
        {/*  native */}
        {/*  reset */}
        {/*  unique */}
        {/*  items={pageIndex} */}
        {/*  from={{ transform: `translateX(${direction === 'right' ? '0%' : '-100%'})`, opacity: 0 }} */}
        {/*  enter={{ transform: 'translateX(-50%)', opacity: 1 }} */}
        {/*  leave={{ transform: `translateX(${direction === 'right' ? '-100%' : '0%'})`, opacity: 0 }} > */}
        {/*  {index => this.titles[index]} */}
        {/* </Transition > */}
        <Transition
          unique
          items={0}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }} >
          {() => springs => <animated.div
            className={cx(styles.navBarTitle)}
            style={springs} >
            {appTitle}
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
              <Button type="icon" className={cx(styles.btn)} onClick={logOut} >
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
  appTitle: PropTypes.string.isRequired,
  goBackPath: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  uid: Auth.selectors.uid(state),
  pathname: Routes.selectors.pathname(state),
  goBackPath: Routes.selectors.goBackPath(state),
  appTitle: 'Reactor',
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(Auth.actions.logOut()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NavBar);
