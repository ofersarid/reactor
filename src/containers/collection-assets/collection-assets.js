import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import LinesEllipsisLoose from 'react-lines-ellipsis/lib/loose';
import { firestoreConnect } from 'react-redux-firebase';
import moment from 'moment/moment';
import cx from 'classnames';
import JSON5 from 'json5';
import PropTypes from 'prop-types';
import services from '/src/services';
import { Button } from '/src/shared';
import { Add } from 'styled-icons/material/Add/Add';
import styles from './styles.scss';

class Collection extends PureComponent {
  constructor(props) {
    super(props);
    props.setGoBackPath('/cms/home');
    if (props.collectionMeta) {
      props.updateAppTitle(props.collectionMeta.name);
    }
  }

  componentDidUpdate(prevProps) {
    const { collectionMeta, updateAppTitle } = this.props;
    if (!prevProps.collectionMeta && collectionMeta) {
      updateAppTitle(collectionMeta.name);
    }
  }

  interpolateValue(item, property) {
    const value = item[property];
    if (!value) return '';
    if (typeof value === 'string') {
      return value;
    } else if (value.toDate) {
      return moment(value.toDate()).format('MMM Do YYYY');
    }
    return 'error: could not interpolate value';
  }

  render() {
    const { collectionAssets, collectionMeta, collectionId, schema } = this.props;
    return (
      <div className={styles.container} >
        {collectionAssets && collectionAssets.map(item => (
          <Button
            key={item.id}
            className={cx(styles.itemWrapper, { [styles.published]: item.published || item.published === undefined })}
            type="white"
            linkTo={`/cms/collection/${collectionId}/editor/${item.id}`}
            justifyContent="start"
          >
            <div className={styles.itemTitle} >
              {this.interpolateValue(item, collectionMeta.layout.title || schema[0].key)}
            </div >
            <LinesEllipsisLoose
              text={this.interpolateValue(item, collectionMeta.layout.body || (schema[1] ? schema[1].key : ''))}
              maxLine='4'
              lineHeight='24'
              className={styles.itemBody}
            />
          </Button >
        ))}
        <Button
          type="circle"
          className={styles.addBtn}
          linkTo={`/cms/collection/${collectionId}/editor/new`}
        >
          <Add />
        </Button >
      </div >
    );
  }
}

Collection.propTypes = {
  collectionId: PropTypes.string,
  collectionAssets: PropTypes.arrayOf(PropTypes.object),
  collectionMeta: PropTypes.shape({
    layout: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string,
    }),
    name: PropTypes.string,
  }),
  setGoBackPath: PropTypes.func.isRequired,
  updateAppTitle: PropTypes.func.isRequired,
  schema: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  collectionId: services.router.selectors.collectionId(state),
  collectionAssets: services.collections.selectors.assets(state),
  collectionMeta: services.collections.selectors.item(state),
  schema: (() => {
    const item = services.collections.selectors.item(state);
    return item ? JSON5.parse(item.schema) : [];
  })(),
});

const mapDispatchToProps = dispatch => ({
  setGoBackPath: path => dispatch(services.router.actions.setGoBackPath(path)),
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    return props.collectionId ? [{
      collection: 'collections',
      doc: props.collectionId,
    }, {
      collection: 'collections',
      doc: props.collectionId,
      subcollections: [{ collection: 'data' }],
    }] : [];
  }),
)(Collection);
