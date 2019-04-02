import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Routes from '/src/routes';
import Auth from '/src/cms/auth';
import { hashHistory } from 'react-router';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Button } from '/src/elements';
import Collections from '/src/cms/collections';
import styles from './styles.scss';
import { collections } from '../types';

class CollectionList extends PureComponent {
  componentDidUpdate() {
    const { collectionId, userCollectionIds, pathname } = this.props;
    if (pathname.match(/^\/cms\/collection\//) &&
      !userCollectionIds.includes(collectionId) &&
      userCollectionIds.length) {
      hashHistory.push(`cms/collection/${userCollectionIds[0]}`);
    }
  }

  render() {
    const { userCollections, collectionId } = this.props;
    return userCollections ? (
      <ul className={styles.collections} >
        {userCollections.map(collection => {
          const isActive = collection.id === collectionId;
          return collection.name ? (
            <li key={collection.id} >
              <Button
                linkTo={isActive ? null : `/cms/collection/${collection.id}`}
                className={styles.navButton}
                textColor={isActive ? 'green' : null}
                stretch
              >
                <div >{collection.name}</div >
                {isActive && (
                  <div className={styles.indicator} />
                )}
              </Button >
            </li >
          ) : null;
        })}
      </ul >
    ) : null;
  }
}

CollectionList.propTypes = collections;

const mapStateToProps = state => ({
  userCollectionIds: Auth.selectors.userCollectionIds(state),
  userCollections: Collections.selectors.userCollections(state),
  collectionId: Routes.selectors.collectionId(state),
  pathname: Routes.selectors.pathname(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    return props.userCollectionIds.reduce((accumulator, id) => {
      accumulator.push({
        collection: 'collections',
        doc: id,
      });
      return accumulator;
    }, []);
  }),
)(CollectionList);
