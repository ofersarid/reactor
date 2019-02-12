import React, { PureComponent } from 'react';
import cx from 'classnames';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import styles from './styles.scss';
import { sideNav } from './types';
import PageList from './page-list/page-list';
import { Button } from '/src/cms/elements';
import { ChevronLeft } from 'styled-icons/fa-solid/ChevronLeft';
import { toggleSideNav } from '../../actions';
import { sideNavOpen } from '../../selectors';
import { SIDE_NAV_WIDTH, SIDE_NAV_COLLAPSE_WIDTH } from '../../constants';

class SideNav extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
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
          className={`waves-color ${styles.btn}`}
          onClick={toggleSideNav}
        >
          <ChevronLeft className={cx(!sideNavOpen && styles.flip)} />
        </Button >
        <PageList />
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

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
