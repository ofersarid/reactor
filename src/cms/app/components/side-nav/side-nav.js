import React, { PureComponent } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
// import ImageAsync from 'react-image-async';
import { compose } from 'redux';
import Device from '/src/device';
// import Puff from '/src/svg-loaders/puff.svg';
// import { Button } from '/src/elements';
import Routes from '/src/routes/index';
// import { FileUpload } from 'styled-icons/material/FileUpload';
import styles from './styles.scss';
import CollectionList from './collection-list/collection-list';
import logo from './logo.svg';
// import { ChevronLeft } from 'styled-icons/fa-solid/ChevronLeft';
import { toggleSideNav } from '../../actions';
import { sideNavOpen } from '../../selectors';
// import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSE_WIDTH } from '../../constants';
import { sideNav } from './types';

class SideNav extends PureComponent {
  componentDidMount() {
    const { isMobile, toggleSideNav } = this.props;
    if (isMobile) {
      toggleSideNav();
    }
  }

  render() {
    return (
      <div
        className={cx(styles.sideNav)}
        // style={{
        //   width: sideNavOpen ? SIDE_NAV_WIDTH : SIDE_NAV_COLLAPSE_WIDTH,
        // }}
      >
        <img className={styles.logo} src={logo} />
        {/* <ImageAsync src={['clientLogo']} > */}
        {/* {({ loaded, error }) => ( */}
        {/* <div style={{ backgroundImage: `url(${loaded ? 'clientLogo' : Puff})` }} className={styles.clientLogo} > */}
        {/* {error && ( */}
        {/* <Button justIcon > */}
        {/* <FileUpload /> */}
        {/* </Button> */}
        {/* )} */}
        {/* </div> */}
        {/* )} */}
        {/* </ImageAsync > */}
        <CollectionList />
        {/* <Button */}
        {/* stretch */}
        {/* className={styles.btn} */}
        {/* onClick={toggleSideNav} */}
        {/* > */}
        {/* <ChevronLeft className={cx(!sideNavOpen && styles.flip)} /> */}
        {/* </Button > */}
      </div >
    );
  }
}

SideNav.propTypes = sideNav;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  sideNavOpen: sideNavOpen(state),
  pathname: Routes.selectors.pathname(state),
});

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SideNav);
