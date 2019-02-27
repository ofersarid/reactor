import React, { PureComponent } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import { compose } from 'redux';
import { Button } from '/src/cms/elements';
import styles from './styles.scss';
import CollectionList from './collection-list/collection-list';
import { ChevronLeft } from 'styled-icons/fa-solid/ChevronLeft';
import { toggleSideNav } from '../../actions';
import { sideNavOpen } from '../../selectors';
import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSE_WIDTH } from '../../constants';
import { sideNav } from './types';

class SideNav extends PureComponent {
  componentDidMount() {
    const { isMobile, toggleSideNav } = this.props;
    if (isMobile) {
      toggleSideNav();
    }
  }

  render() {
    const { toggleSideNav, sideNavOpen } = this.props;
    return (
      <div
        className={cx(styles.sideNav)}
        style={{
          width: sideNavOpen ? SIDE_NAV_WIDTH : SIDE_NAV_COLLAPSE_WIDTH,
        }}
      >
        <Button
          stretch
          className={styles.btn}
          onClick={toggleSideNav}
        >
          <ChevronLeft className={cx(!sideNavOpen && styles.flip)} />
        </Button >
        <CollectionList />
      </div >
    );
  }
}

SideNav.propTypes = sideNav;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  sideNavOpen: sideNavOpen(state),
});

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SideNav);
