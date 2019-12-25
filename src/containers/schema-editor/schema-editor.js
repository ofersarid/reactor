import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import JSON5 from 'json5';
import autoBind from 'auto-bind';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import services from '/src/services';
import { UserInput, Button } from '/src/shared';
import { fromJS } from 'immutable';
import { inputTypes, validationFunctionTypes } from '/src/shared/user-input/types';
// import SchemaEditorFooter from './schema-editor-footer';
import styles from './styles.scss';

class SchemaEditor extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      key: '',
      label: '',
      type: 'multi-line',
      required: true,
      validateWith: 'min-max',
      options: fromJS([]),
      maxChars: null,
      minChars: 0,
      isValid: false,
    };
    const { collectionId, pageId, metaData } = this.props;
    props.setGoBackPath(`cms/${collectionId ? 'collection' : 'page'}/${collectionId || pageId}/schema`);
    props.updateAppTitle(metaData ? metaData.name : null);
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { updateAppTitle, metaData } = this.props;
    const { type } = this.state;
    if (metaData && prevProps.metaData) {
      if (metaData.name !== prevProps.metaData.name) {
        updateAppTitle(metaData.name);
      }
    } else if (metaData) {
      updateAppTitle(metaData.name);
    }
    if (type !== prevState.type) {
      this.setState({ options: fromJS([]) });
    }
    this.validate();
  }

  validate() {
    const { key, label, type, required, validateWith, options, maxChars, minChars } = this.state;
    this.setState({
      isValid: key.length > 0 &&
        label.length > 0 &&
        inputTypes.includes(type) &&
        (required ? minChars > 0 : true) &&
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
    const { key, label, type, required, validateWith, options, isValid } = this.state; // eslint-disable-line
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
            type="multi-line"
            validateWith={val => (val > 0 && val <= 40)}
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
            validateWith={val => (val > 0 && val <= 40)}
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
              validateWith={val => (val > 0 && val <= 40)}
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
        {!['select', 'switch', 'multi-select'].includes(type) && (
          <div className={cx(styles.inputWrapper)} >
            <UserInput
              onChange={value => this.onChange({
                validateWith: value.trim().toLowerCase(),
              })}
              value={validateWith}
              label="Validation Function"
              type="select"
              options={validationFunctionTypes.map(item => ({ view: item, value: item }))}
            />
          </div >
        )}
        {/* <SchemaEditorFooter isValid={isValid} onShowHideChange={this.onChange} /> */}
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
};

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
  collectionId: services.router.selectors.collectionId(state),
  pageId: services.router.selectors.pageId(state),
  pathname: services.router.selectors.pathname(state),
  metaData: (() => {
    const metaData = services[ownProps.collectionId ? 'collections' : 'pages'].selectors.item(state);
    return metaData;
  })(),
});

const mapDispatchToProps = dispatch => ({
  setGoBackPath: path => dispatch(services.router.actions.setGoBackPath(path)),
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle)),
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
      subcollections: [{
        collection: 'data',
        doc: props.assetId,
      }],
    }] : props.pageId ? [{
      collection: 'pages',
      doc: props.pageId,
    }] : [];
  }),
)(SchemaEditor);
