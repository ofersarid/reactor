import React, { PureComponent, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import JSON5 from 'json5';
import autoBind from 'auto-bind';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import services from '/src/services';
import { UserInput, Button } from '/src/shared';
import { fromJS } from 'immutable';
import { withRouter } from 'react-router';
import { inputTypes, validationFunctionTypes, inputTypesWithValidationFunction } from '/src/shared/user-input/types';
import SchemaEditorFooter from './schema-editor-footer';
import styles from './styles.scss';

class SchemaEditor extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    const { collectionId, pageId, metaData, fieldIndex } = this.props;
    this.initialState = {
      key: '',
      label: '',
      type: 'multi-line',
      required: true,
      validateWith: 'min-max',
      options: fromJS([]),
      maxChars: undefined,
      minChars: 1,
      isValid: false,
    };
    this.state = (metaData && fieldIndex >= 0) ? this.parseSchema(metaData.schema, fieldIndex) : this.initialState;
    props.setGoBackPath(`cms/${collectionId ? 'collection' : 'page'}/${collectionId || pageId}/schema`);
    props.updateAppTitle(metaData ? metaData.name : null);
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { updateAppTitle, metaData, fieldIndex } = this.props;
    const { type } = this.state;
    if (metaData && prevProps.metaData) {
      if (metaData.name !== prevProps.metaData.name) {
        updateAppTitle(metaData.name);
      }
    } else if (metaData) {
      updateAppTitle(metaData.name);
    }
    if (metaData && !prevProps.metaData) {
      this.setState(this.parseSchema(metaData.schema, fieldIndex));
    }
    if (type !== prevState.type) {
      this.setState({ options: fromJS([]) });
    }
    this.validate();
  }

  parseSchema(schemaString, fieldIndex) {
    const parsed = JSON5.parse(schemaString);
    return Object.assign({}, this.initialState, parsed[fieldIndex]);
  }

  validate() {
    const { key, label, type, required, validateWith, options, maxChars, minChars } = this.state;
    this.setState({
      isValid: key.length > 0 &&
        label.length > 0 &&
        inputTypes.includes(type) &&
        (required && ['single-line', 'multi-line', 'multi-line-preserve-lines', 'rich'].includes(type) ? minChars > 0 : true) &&
        (type === 'multi-select' ? options.size > 0 : true) &&
        (type === 'switch' ? options.size > 1 : true) &&
        (validateWith ? validationFunctionTypes.includes(validateWith) : true) &&
        (maxChars ? maxChars > minChars : true)
    });
  }

  onChange(change) {
    this.setState(change);
  }

  render() {
    const {
      key, label, type, required, validateWith,
      options, minChars, maxChars, isValid,
    } = this.state;
    const { origin } = this.props;
    return (
      <div className={styles.editor} >
        <div className={cx(styles.inputWrapper)} >
          <UserInput
            placeholder="Object Key"
            onChange={value => this.onChange({
              key: value.replace(/ /g, ''),
            })}
            value={key}
            label="Key"
            max={40}
            required
            disabled={Boolean(origin)}
            type="multi-line"
            validateWith={val => (val.length > 0 && val.length <= 40)}
          />
        </div >
        <div className={cx(styles.inputWrapper)} >
          <UserInput
            placeholder="Reactor Label"
            onChange={value => this.onChange({
              label: value.replace(/\s+/g, ' '),
            })}
            value={label}
            label="Label"
            max={40}
            required
            type="multi-line"
            validateWith={val => (val.length > 0 && val.length <= 40)}
          />
        </div >
        <div className={cx(styles.inputWrapper)} >
          <UserInput
            onChange={value => this.onChange({
              type: value.trim().toLowerCase(),
            })}
            value={type}
            label="Type"
            type="select"
            placeholder="Select Input Type"
            options={inputTypes.map(item => ({ view: item, value: item }))}
            validateWith={val => val && val.length > 0}
          />
        </div >
        {['select', 'switch', 'multi-select'].includes(type) && options.map((opt, i) => (
          <div key={`option-${i}`} className={cx(styles.inputWrapper)} >
            <UserInput
              placeholder="Option View"
              onChange={value => this.onChange({ options: options.set(i, value) })}
              value={opt}
              label={`Option #${i}`}
              max={40}
              required
              type="multi-line"
              validateWith={val => (val.length > 0 && val.length <= 40)}
            />
          </div >
        ))}
        {['select', 'switch', 'multi-select'].includes(type) && (
          <div className={cx(styles.inputWrapper)} >
            <Button
              onClick={() => {
                this.setState({
                  options: options.push('')
                });
              }}
            >
              Add Option
            </Button >
          </div >
        )}
        {!['select', 'switch'].includes(type) && (
          <div className={cx(styles.inputWrapper)} >
            <UserInput
              onChange={value => this.onChange({
                required: value,
              })}
              value={required}
              label="Required"
              type="switch"
              options={[{
                view: 'Yes',
                value: true,
              }, {
                view: 'No',
                value: false,
              }]}
            />
          </div >
        )}
        {inputTypesWithValidationFunction.includes(type) && (
          <div className={cx(styles.inputWrapper)} >
            <UserInput
              onChange={value => this.onChange({
                validateWith: value.trim().toLowerCase(),
              })}
              value={validateWith}
              label="Validation Function"
              type="select"
              options={validationFunctionTypes}
              validateWith={val => val && val.length > 0}
            />
          </div >
        )}
        {inputTypesWithValidationFunction.includes(type) && validateWith === 'min-max' && (
          <Fragment >
            <div className={cx(styles.inputWrapper)} >
              <UserInput
                placeholder="Min Chars"
                onChange={value => this.onChange({
                  minChars: parseInt(value.replace(/[\D]/g, '')),
                })}
                value={`${minChars}`}
                label="Min Chars"
                max={5}
                required
                type="multi-line"
                validateWith={val => (maxChars ? parseInt(val) <= maxChars : parseInt(val) >= 0)}
              />
            </div >
            <div className={cx(styles.inputWrapper)} >
              <UserInput
                placeholder="Auto"
                onChange={value => this.onChange({
                  maxChars: parseInt(value.replace(/[\D]/g, '')),
                })}
                value={`${maxChars || ''}`}
                label="Max Chars"
                max={5}
                required
                type="multi-line"
                validateWith={val => (val ? minChars ? parseInt(val) >= minChars : parseInt(val) >= 1 : true)}
              />
            </div >
          </Fragment >
        )}
        <SchemaEditorFooter isValid={isValid} field={{
          key,
          label,
          type,
          required,
          validateWith,
          options,
          minChars: minChars,
          maxChars: maxChars,
        }} origin={origin} />
      </div >
    );
  }
}

SchemaEditor.propTypes = {
  collectionId: PropTypes.string,
  pageId: PropTypes.string,
  pathname: PropTypes.string.isRequired,
  setGoBackPath: PropTypes.func.isRequired,
  updateAppTitle: PropTypes.func.isRequired,
  metaData: PropTypes.object,
  origin: PropTypes.object,
  fieldIndex: PropTypes.number,
};

const mapStateToProps = state => ({ // eslint-disable-line
  collectionId: services.router.selectors.collectionId(state),
  pageId: services.router.selectors.pageId(state),
  fieldIndex: services.router.selectors.fieldIndex(state),
  pathname: services.router.selectors.pathname(state),
  metaData: (() => {
    const metaData = services[services.router.selectors.collectionId(state) ? 'collections' : 'pages'].selectors.item(state);
    return metaData;
  })(),
  origin: (() => {
    const metaData = services[services.router.selectors.collectionId(state) ? 'collections' : 'pages'].selectors.item(state);
    return metaData ? JSON5.parse(metaData.schema)[services.router.selectors.fieldIndex(state)] : undefined;
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
      storeAs: 'assets',
    }] : props.pageId ? [{
      collection: 'pages',
      doc: props.pageId,
    }] : [];
  }),
)(SchemaEditor);
