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
    return userCollections ? (
      <ul className={styles.collections} >
        {Object.keys(userCollections).map(key => {
          const isActive = key === collectionId;
          return (
            <li key={key} >
              <Button
                linkTo={isActive ? null : `/cms/collections/${key}`}
                className={styles.navButton}
                textColor={isActive ? 'green' : null}
                stretch
              >
                <Tooltip content={!sideNavOpen ? userCollections[key].name : null} position="right" >
                  <Icons name={userCollections[key].icon} />
                </Tooltip >
                <div >{userCollections[key].name}</div >
                {isActive && (
                  <div className={styles.indicator} />
                )}
              </Button >
            </li >
          );
        })}
      </ul >
    ) : null;
  }
}

CollectionList.propTypes = collections;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
  userCollectionIds: Auth.selectors.userCollectionIds(state),
  userCollections: Collections.selectors.userCollectionsMap(state),
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
