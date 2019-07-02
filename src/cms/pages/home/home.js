import React, { Fragment } from 'react';
import cx from 'classnames';
import { Trail, animated } from 'react-spring/renderprops';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Switch, SwitchItem, Button } from '/src/cms/components';
import PropTypes from 'prop-types';
import services from '/src/cms/services';
import Routes from '/src/routes';
import styles from './styles.scss';
import Auth from '../../components/auth';

const listToIndex = list => {
  switch (list) {
    case 'pages':
      return 1;
    default:
      return 0;
  }
};

class Home extends React.PureComponent {
  render() {
    const { listName, selectList, collections, pages, userCollectionIds } = this.props;
    return (
      <Fragment >
        <Switch indicateIndex={listToIndex(listName)} className={styles.switch} >
          <SwitchItem onClick={() => selectList('collections')} >Collections</SwitchItem >
          <SwitchItem onClick={() => selectList('pages')} >Pages</SwitchItem >
        </Switch >
        {(collections.length === userCollectionIds.length) && (
          <Fragment>
            <div
              className={cx(styles.listContainer, {
                [styles.focus]: listName === 'collections',
              })}
            >
              <Trail
                native
                initial={listName === 'collections' ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                items={collections}
                keys={item => item.name}
                from={listName === 'collections' ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
                to={listName === 'collections' ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
              >
                {item => (springs) => ( // eslint-disable-line
                  <animated.div key={item.id} className={styles.listItemWrap} style={{
                    opacity: springs.opacity,
                    transform: springs.x.interpolate(x => `translate3d(${x}%,0,0)`),
                  }} >
                    <Button linkTo={`/cms/collection/${item.id}`} type="white" justifyContent="start" >
                      {item.name}
                    </Button >
                  </animated.div >
                )}
              </Trail >
            </div >
            <div className={cx(styles.listContainer, { [styles.focus]: listName === 'pages' })} >
              <Trail
                native
                initial={listName === 'pages' ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                items={pages}
                keys={item => item.name}
                from={listName === 'pages' ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
                to={listName === 'pages' ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
              >
                {item => springs => (
                  <animated.div key={item.id} className={styles.listItemWrap} style={{
                    opacity: springs.opacity,
                    transform: springs.x.interpolate(x => `translate3d(${x}%,0,0)`),
                  }} >
                    <Button linkTo={`/cms/page/${item.id}/editor`} type="white" justifyContent="start" >
                      {item.name}
                    </Button >
                  </animated.div >
                )}
              </Trail >
            </div >
          </Fragment>
        )}
      </Fragment >
    );
  }
}

Home.propTypes = {
  userCollectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  userCollections: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string.required,
  })),
  selectList: PropTypes.func.isRequired,
  listName: PropTypes.string.isRequired,
  prevPath: PropTypes.string.isRequired,
  collections: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })),
};

const mapStateToProps = state => ({
  listName: services.home.selectors.listName(state),
  prevPath: Routes.selectors.prevPath(state),
  userCollectionIds: Auth.selectors.userCollectionIds(state),
  userPageIds: Auth.selectors.userPageIds(state),
  collections: services.collections.selectors.collections(state),
  pages: services.pages.selectors.pages(state),
});

const mapDispatchToProps = dispatch => ({
  selectList: (...props) => dispatch(services.home.actions.selectList(...props)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    let aggregated = [];
    aggregated = aggregated.concat(props.userCollectionIds.reduce((accumulator, id) => {
      accumulator.push({
        collection: 'collections',
        doc: id,
      });
      return accumulator;
    }, []));
    aggregated = aggregated.concat(props.userPageIds.reduce((accumulator, id) => {
      accumulator.push({
        collection: 'pages',
        doc: id,
      });
      return accumulator;
    }, []));
    return aggregated;
  }),
)(Home);
