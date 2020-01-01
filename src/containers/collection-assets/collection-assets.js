import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import LinesEllipsisLoose from 'react-lines-ellipsis/lib/loose';
import { firestoreConnect } from 'react-redux-firebase';
import moment from 'moment/moment';
import cx from 'classnames';
import autoBind from 'auto-bind';
import JSON5 from 'json5';
import PropTypes from 'prop-types';
import services from '/src/services';
import { Button } from '/src/shared';
import { Add } from 'styled-icons/material/Add/Add';
import styles from './styles.scss';

const SortableItem = SortableElement(({ children }) => <li >{children}</li >);

const SortableList = SortableContainer((
  { items, collectionId, collectionMeta, schema, interpolateValue }) => {
  return (
    <ul >
      {items.map((itm, i) => (
        <SortableItem key={`item-${itm.id}`} index={i} >
          <Button
            className={cx(styles.itemWrapper, { [styles.published]: itm.published || itm.published === undefined })}
            type="white"
            linkTo={`/cms/collection/${collectionId}/editor/${itm.id}`}
            justifyContent="start"
          >
            <div className={styles.itemTitle} >
              {interpolateValue(itm, collectionMeta.layout.title || schema[0].key)}
            </div >
            <LinesEllipsisLoose
              text={interpolateValue(itm, collectionMeta.layout.body || (schema[1] ? schema[1].key : ''))}
              maxLine='4'
              lineHeight='24'
              className={styles.itemBody}
            />
          </Button >
        </SortableItem >
      ))}
    </ul >
  );
});

class Collection extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    props.setGoBackPath('/cms/home');
    if (props.collectionMeta) {
      props.updateAppTitle(props.collectionMeta.name);
    }
    this.state = {
      sorting: false,
    };
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

  async onSortEnd(sorted) {
    const { collectionMeta, collectionId, sortAssets } = this.props;
    const order = collectionMeta.order.split(' | ');
    console.log(order);
    const moveMe = order[sorted.oldIndex];
    order.splice(sorted.oldIndex, 1);
    order.splice(sorted.newIndex, 0, moveMe);
    await sortAssets(collectionId, order.join(' | '));
    this.setState({ sorting: false });
  }

  onSortStart() {
    this.setState({ sorting: true });
  }

  render() {
    const { collectionAssets, collectionMeta, collectionId, schema } = this.props;
    const { sorting } = this.state;
    return (
      <div className={cx(styles.container, { [styles.sorting]: sorting })} >
        <SortableList
          items={collectionAssets || []}
          onSortEnd={this.onSortEnd}
          pressDelay={300}
          transitionDuration={500}
          lockToContainerEdges
          helperClass={styles.dragging}
          onSortStart={this.onSortStart}
          collectionId={collectionId}
          collectionMeta={collectionMeta}
          schema={schema}
          lockAxis="y"
          interpolateValue={this.interpolateValue}
        />
        <Button
          type="circle"
          className={styles.addBtn}
          linkTo={`/cms/collection/${collectionId}/editor`}
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
    }), // layout is deprecated
    name: PropTypes.string.isRequired,
    order: PropTypes.string.isRequired,
  }),
  setGoBackPath: PropTypes.func.isRequired,
  updateAppTitle: PropTypes.func.isRequired,
  sortAssets: PropTypes.func.isRequired,
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
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle)),
  sortAssets: (order, id) => dispatch(services.collections.actions.sortAssets(order, id))
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
      storeAs: 'assets',
    }] : [];
  }),
)(Collection);
