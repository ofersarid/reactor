import React from 'react';
import Routes from '/src/routes/index';
import { compose } from 'redux';
import connect from 'react-redux/es/connect/connect';
import Grid from './grid';
import { collectionContainer } from '../../types';
import * as selectors from '../../selectors';

const CollectionContainer = props => {
  return props.collection ? (
    <Grid
      route={`cms/${props.collectionId}`}
      collection={props.collectionId}
      filters={props.collection.filters}
      sortOptions={props.collection.sortOptions}
      icon={props.collection.icon}
      entity={props.collection.entity}
    >
      {props.children}
    </Grid >
  ) : null;
};

CollectionContainer.propTypes = collectionContainer;

const mapStateToProps = state => ({
  pathname: Routes.selectors.pathname(state),
  collectionId: Routes.selectors.collectionId(state),
  collection: selectors.collection(state),
});

export default compose(
  connect(mapStateToProps, {}),
)(CollectionContainer);
