import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import JSON5 from 'json5';
import services from '/src/services';
import { Button } from '/src/shared';
import {
  inputTypesWithValidationFunction,
  inputTypesWithOptions,
  inputTypesWithMinMaxChars
} from '/src/shared/user-input/types';
import styles from './styles.scss';
import { hashHistory } from 'react-router';

class SchemaEditorFooter extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isWorking: false,
      deleting: false,
    };
  }

  componentDidMount() {
    this.$pageContainer = document.getElementsByClassName('pageContainer');
    this.$pageContainer = this.$pageContainer[this.$pageContainer.length - 1];
  }

  handleClickOnDone() {
    const { addField, field, collectionId, pageId, fieldIndex } = this.props;
    this.setState({ isWorking: true });
    addField(collectionId || pageId, field, fieldIndex, collectionId ? 'collections' : 'pages').then(this.goBack);
  }

  goBack() {
    const { goBackPath } = this.props;
    if (goBackPath) {
      hashHistory.push(goBackPath);
    } else {
      hashHistory.push('cms/home');
    }
  }

  handleClickOnDelete() {
    const { deleteField, fieldIndex, collectionId, pageId } = this.props;
    this.setState({ deleting: true });
    deleteField(collectionId || pageId, fieldIndex, collectionId ? 'collections' : 'pages').then(this.goBack);
  }

  render() {
    const { isValid, origin } = this.props;
    return (
      <div className={cx(styles.editorFooter)} >
        <Button
          className={styles.footerBtn}
          disable={!isValid}
          onClick={this.handleClickOnDone}
        >
          Save
        </Button >
        {origin && (
          <Button
            className={styles.footerBtn}
            type="red"
            onClick={this.handleClickOnDelete}
          >
            Delete
          </Button >
        )}
      </div >
    );
  }
}

SchemaEditorFooter.propTypes = {
  field: PropTypes.object,
  isValid: PropTypes.bool.isRequired,
  collectionId: PropTypes.string,
  pageId: PropTypes.string,
  goBackPath: PropTypes.string,
  // deleteAsset: PropTypes.func.isRequired,
  addField: PropTypes.func.isRequired,
  deleteField: PropTypes.func.isRequired,
  fieldIndex: PropTypes.number,
  origin: PropTypes.object,
};

const mapStateToProps = state => ({
  collectionId: services.router.selectors.collectionId(state),
  pageId: services.router.selectors.pageId(state),
  goBackPath: services.router.selectors.goBackPath(state),
  fieldIndex: services.router.selectors.fieldIndex(state),
});

const mapDispatchToProps = (dispatch) => ({
  // deleteAsset: asset => dispatch(services.asset.actions.delete(asset)),
  addField: (id, field, index, serviceType) => dispatch(services[serviceType].actions
    .addField(id, index, {
      key: field.key,
      label: field.label,
      type: field.type,
      required: field.required,
      validateWith: inputTypesWithValidationFunction.includes(field.type) ? field.validateWith : undefined,
      options: inputTypesWithOptions.includes(field.type) ? JSON5.stringify(field.options) : undefined,
      minChars: inputTypesWithMinMaxChars.includes(field.type) ? field.minChars : undefined,
      maxChars: inputTypesWithMinMaxChars.includes(field.type) ? field.maxChars : undefined,
    })),
  deleteField: (id, index, serviceType) => dispatch(services[serviceType].actions.deleteField(id, index))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SchemaEditorFooter);
