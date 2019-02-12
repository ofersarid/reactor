import React from 'react';
import Grid from './grid';
import { collectionContainer } from '../../types';
import CollectionEditor from '../collection-editor/collection-editor';
import Routes from '../../../../routes/index';
import { compose } from 'redux';
import connect from 'react-redux/es/connect/connect';

const CollectionContainer = props => (
  <Grid
    route={`cms/${props.id}`}
    collection={props.id}
    filters={props.filters}
    sortOptions={props.sortOptions}
    icon={props.icon}
    fields={props.fields}
    downloadCsv={props.downloadCsv}
  >
    {props.pathname.split(props.id)[1] && <CollectionEditor {...props} />}
  </Grid >
);

CollectionContainer.propTypes = collectionContainer;

const mapStateToProps = (state, ownProps) => ({
  pathname: Routes.selectors.pathname(state),
});

export default compose(
  connect(mapStateToProps, {}),
)(CollectionContainer);
