import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, SwitchItem } from '/src/cms/components';
import PropTypes from 'prop-types';
import services from '/src/cms/services';
import styles from './styles.scss';

const listToIndex = list => {
  switch (list) {
    case 'pages':
      return 1;
    default:
      return 0;
  }
};

const Home = ({ list, selectList }) => (
  <div className={cx(styles.pagesCollections)} >
    <Switch selected={listToIndex(list)} >
      <SwitchItem onClick={() => selectList('collections')} >Collections</SwitchItem >
      <SwitchItem onClick={() => selectList('pages')} >Pages</SwitchItem >
    </Switch >
  </div >
);

Home.propTypes = {
  selectList: PropTypes.func.isRequired,
  list: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  list: services.home.selectors.list(state),
});

const mapDispatchToProps = dispatch => ({
  selectList: (...props) => dispatch(services.home.actions.selectList(...props)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Home);
