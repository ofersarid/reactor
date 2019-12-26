import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import JSON5 from 'json5';
import autoBind from 'auto-bind';
import cx from 'classnames';
import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import services from '/src/services';
import { Button } from '/src/shared';
import { Add } from 'styled-icons/material';
import { withRouter } from 'react-router';
import styles from './styles.scss';

class Schema extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      schema: props.schema,
      isValid: false,
      deleting: false,
      isWorking: false,
    };
    props.setGoBackPath(`/cms/home`);
    props.updateAppTitle(props.name);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_isEqual(nextProps.schema, prevState.schema)) {
      return {
        schema: nextProps.schema,
      };
    }
    return {};
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { updateAppTitle, name } = this.props;
    if (name !== prevProps.name) {
      updateAppTitle(name);
    }
  }

  validate() {
    const { schema } = this.state;
    return schema.length && JSON5.stringify(schema) !== JSON5.stringify(this.props.schema);
  }

  render() {
    const { collectionId, pageId, schema } = this.props;
    return (
      <div className={styles.schemaPage} >
        {schema.map((itm, i) => (
          <Button
            key={itm.key}
            className={cx(styles.itemWrapper)}
            type="white"
            linkTo={`/cms/${collectionId ? 'collection' : 'page'}/${collectionId || pageId}/schema/${i}/editor/`}
            justifyContent="start"
          >
            <div className={styles.label} >{itm.label}</div >
            {Object.keys(itm).map((key, i) => key === 'label' ? null : (
              <div key={`${key}-${i}`} className={styles[key]}>{key}: {itm[key].toString()}</div>
            ))}
          </Button >
        ))}
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
});

const mapDispatchToProps = dispatch => ({
  setGoBackPath: path => dispatch(services.router.actions.setGoBackPath(path)),
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle)),
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
    }] : props.pageId ? [{
      collection: 'pages',
      doc: props.pageId,
    }] : [];
  }),
)(Schema);
