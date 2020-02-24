import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import JSON5 from 'json5';
import autoBind from 'auto-bind';
import animateScrollTo from 'animated-scroll-to';
import cx from 'classnames';
import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import services from '/src/services';
import { Button } from '/src/shared';
import { Add } from 'styled-icons/material';
import { hashHistory, withRouter } from 'react-router';
import styles from './styles.scss';

const SortableItem = SortableElement(({ children }) => <li >{children}</li >);

const SortableList = SortableContainer(({ items, collectionId, pageId }) => {
  return (
    <ul >
      {items.map((itm, i) => (
        <SortableItem key={`item-${itm.key}`} index={i} >
          <Button
            className={cx(styles.itemWrapper)}
            type="white"
            linkTo={`/cms/${collectionId ? 'collection' : 'page'}/${collectionId || pageId}/schema/${i}/editor/`}
            justifyContent="start"
          >
            <div className={styles.label} >{itm.label}</div >
            {Object.keys(itm).map((key, i) => key === 'label' ? null : (
              <div key={`${key}-${i}`} className={`schema-item-${key}`} >{key}: {itm[key].toString()}</div >
            ))}
          </Button >
        </SortableItem >
      ))}
    </ul >
  );
});

class Schema extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      schema: props.schema,
      isValid: false,
      deleting: false,
      isWorking: false,
      sorting: false,
    };
    const { collectionId, pageId, devMode } = props;
    const goBackPath = `/cms/${collectionId ? 'collection' : 'page'}/${collectionId || pageId}`;
    props.setGoBackPath(goBackPath);
    if (!devMode) {
      hashHistory.push(goBackPath);
    }
    props.updateAppTitle(props.name);
    this.$list = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_isEqual(nextProps.schema, prevState.schema)) {
      return {
        schema: nextProps.schema,
      };
    }
    return {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { updateAppTitle, name, schema } = this.props;
    if (name !== prevProps.name) {
      updateAppTitle(name);
    }

    if (schema.length > prevProps.schema.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    animateScrollTo(this.$list.current.scrollHeight, {
      elementToScroll: this.$list.current,
      minDuration: 1000,
    });
  }

  onSortEnd(sorted) {
    const { schema, sortSchema, collectionId, pageId } = this.props;
    const moveMe = schema[sorted.oldIndex];
    schema.splice(sorted.oldIndex, 1);
    schema.splice(sorted.newIndex, 0, moveMe);
    this.setState({ sorting: false });
    sortSchema(schema, collectionId, pageId);
  }

  onSortStart() {
    this.setState({ sorting: true });
  }

  render() {
    const { collectionId, pageId, schema } = this.props;
    const { sorting } = this.state;
    return (
      <div ref={this.$list} className={cx(styles.schemaPage, { [styles.sorting]: sorting })} >
        <SortableList
          items={schema} onSortEnd={this.onSortEnd} pressDelay={300} collectionId={collectionId} lockAxis="y"
          transitionDuration={500} lockToContainerEdges helperClass={styles.dragging} onSortStart={this.onSortStart}
          pageId={pageId} />
        <Button
          type="circle"
          className={cx(styles.addBtn)}
          linkTo={`cms/${collectionId ? 'collection' : 'page'}/${collectionId || pageId}/schema/editor`}
        >
          <Add />
        </Button >
      </div >
    );
  }
}

Schema.propTypes = {
  collectionId: PropTypes.string,
  pageId: PropTypes.string,
  schema: PropTypes.array.isRequired,
  setGoBackPath: PropTypes.func.isRequired,
  name: PropTypes.string,
  updateAppTitle: PropTypes.func.isRequired,
  sortSchema: PropTypes.func.isRequired,
  devMode: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
  collectionId: services.router.selectors.collectionId(state),
  pageId: services.router.selectors.pageId(state),
  schema: (() => {
    const item = services[ownProps.params.collectionId ? 'collections' : 'pages'].selectors.item(state);
    return item ? JSON5.parse(item.schema) : [];
  })(),
  name: (() => {
    const metaData = services[ownProps.params.collectionId ? 'collections' : 'pages'].selectors.item(state);
    return metaData ? metaData.name : null;
  })(),
  devMode: services.app.selectors.devMode(state),
});

const mapDispatchToProps = dispatch => ({
  setGoBackPath: path => dispatch(services.router.actions.setGoBackPath(path)),
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle)),
  sortSchema: (schema, collectionId, pageId) =>
    dispatch(services[collectionId ? 'collections' : 'pages'].actions.sortSchema(collectionId || pageId, schema)),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    return props.collectionId ? [{
      collection: 'collections',
      doc: props.collectionId,
    }, {
      collection: 'collections',
      doc: props.collectionId,
      subcollections: [{
        collection: 'data',
        doc: props.assetId,
      }],
      storeAs: 'assets',
    }] : props.pageId ? [{
      collection: 'pages',
      doc: props.pageId,
    }] : [];
  }),
)(Schema);
