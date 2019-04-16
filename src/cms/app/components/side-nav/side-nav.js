import React, { PureComponent } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Device from '/src/device';
import autoBind from 'auto-bind';
import Routes from '/src/routes/index';
import Collections from '/src/cms/collections';
import styles from './styles.scss';
import CollectionList from './collection-list/collection-list';
import logo from './logo.svg';
import { toggleSideNav } from '../../actions';
import { sideNavOpen } from '../../selectors';
import { sideNav } from './types';

class SideNav extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      newCollectionInputValue: '',
      inputValueIsValid: false,
    };
  }

  componentDidMount() {
    const { isMobile, toggleSideNav } = this.props;
    if (isMobile) {
      toggleSideNav();
    }
  }

  render() {
    return (
      <div className={cx(styles.sideNav)} >
        <div >
          <img className={styles.logo} src={logo} />
          <CollectionList />
        </div >
        <div>
          {/* bottom section */}
        </div>
      </div >
    );
  }
}

SideNav.propTypes = sideNav;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  sideNavOpen: sideNavOpen(state),
  pathname: Routes.selectors.pathname(state),
  userCollections: Collections.selectors.userCollections(state),
});

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
  createDoc: name => dispatch(Collections.actions.createDoc(name)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SideNav);
