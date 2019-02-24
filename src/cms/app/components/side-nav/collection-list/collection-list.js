import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import Routes from '/src/routes';
import Auth from '/src/cms/auth';
import { hashHistory } from 'react-router';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Button, Tooltip, Icons } from '/src/cms/elements';
import Collections from '/src/cms/collections';
import styles from './styles.scss';
import { collections } from '../types';

class CollectionList extends PureComponent {
  componentDidUpdate() {
    const { collectionId, userCollectionIds } = this.props;
    if (!userCollectionIds.includes(collectionId) && userCollectionIds.length) {
      hashHistory.push(`cms/collections/${userCollectionIds[0]}`);
    }
  }

  render() {
    const { userCollections, collectionId, sideNavOpen } = this.props;
    return (
      <ul className={styles.collections} >
        {userCollections.map(collection => {
          const isActive = collection.id === collectionId;
          return (
            <li key={collection.id} >
              <Button
                linkTo={isActive ? null : `/cms/${collection.id}`}
                className={`waves-color ${styles.navButton}`}
                textColor={isActive ? 'green' : null}
                stretch
              >
                <Tooltip content={!sideNavOpen ? collection.name : null} position="right" >
                  <Icons name={collection.icon} />
                </Tooltip >
                <div >{collection.name}</div >
                {isActive && (
                  <div className={styles.indicator} />
                )}
              </Button >
            </li >
          );
        })}
      </ul >
    );
  }
}

CollectionList.propTypes = collections;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
  userCollectionIds: Auth.selectors.userCollectionIds(state),
  userCollections: Collections.selectors.userCollections(state),
  pathname: Routes.selectors.pathname(state),
  collectionId: Routes.selectors.collectionId(state),
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
