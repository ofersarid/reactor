import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import JSON5 from 'json5';
import autoBind from 'auto-bind';
import cx from 'classnames';
import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
// import utils from '/src/utils';
import services from '/src/services';
import { Button, UserInput } from '/src/shared'; // eslint-disable-line
// import { inputTypes } from '/src/shared/user-input/types';
// import SettingsFooter from './settings-footer';
import { Check } from 'styled-icons/boxicons-regular/Check';
import { Add } from 'styled-icons/material';
import styles from './styles.scss';

class Schema extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      schema: props.schema,
      showForm: false,
      isValid: false,
      deleting: false,
      isWorking: false,
    };
    props.setGoBackPath(`/cms/home`);
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

  validate() {
    const { schema } = this.state;
    return schema.length && JSON5.stringify(schema) !== JSON5.stringify(this.props.schema);
  }

  toggleForm() {
    const { showForm } = this.state;
    this.setState({ showForm: !showForm });
  }

  save() {}

  render() {
    const { schema, showForm } = this.state;
    const { collectionId } = this.props;
    return (
      <div className={styles.schemaPage} >
        {!schema.length && <h1 className={styles.message} >
          Add at least one field to this {collectionId ? 'Collection\'s' : 'Page\'s'} schema...</h1 >}
        <Button
          type="circle"
          className={cx(styles.savedBtn, { [styles.show]: showForm })}
          onClick={this.save}
        >
          <Check />
        </Button >
        <Button
          type="circle"
          className={cx(styles.addBtn, { [styles.rotate]: showForm })}
          onClick={this.toggleForm}
        >
          <Add />
        </Button >
      </div >
    );
  }
}

Schema.propTypes = {
  collectionId: PropTypes.string,
  schema: PropTypes.array.isRequired,
  setGoBackPath: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
  collectionId: services.router.selectors.collectionId(state),
  schema: (() => {
    const item = services[ownProps.collectionId ? 'collections' : 'pages'].selectors.item(state);
    return item ? JSON5.parse(item.schema) : [];
  })(),
});

const mapDispatchToProps = dispatch => ({
  setGoBackPath: path => dispatch(services.router.actions.setGoBackPath(path)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    // todo - remove this before pull request
    debugger; // eslint-disable-line
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
