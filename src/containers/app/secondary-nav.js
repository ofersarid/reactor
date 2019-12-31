import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import services from '/src/services';
import styles from './styles.scss';
import { UserInput } from '../../shared';

class SecondaryNav extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.tabs = [{ view: 'Collections', value: 'collections' }, { view: 'Pages', value: 'pages' }];
  }

  render() {
    const { listName, selectList, pathname } = this.props;
    const show = Boolean(pathname.match('/cms/home'));
    return (
      <div className={cx(styles.secondaryNav, { [styles.show]: show })} >
        <UserInput
          type="switch"
          options={this.tabs}
          value={listName}
          onChange={selectList}
          className={styles.tabSection}
        />
      </div >
    );
  }
}

SecondaryNav.propTypes = {
  listName: PropTypes.string.isRequired,
  selectList: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  listName: services.home.selectors.listName(state),
  pathname: services.router.selectors.pathname(state),
});

const mapDispatchToProps = dispatch => ({
  selectList: (...props) => dispatch(services.home.actions.selectList(...props)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SecondaryNav);
