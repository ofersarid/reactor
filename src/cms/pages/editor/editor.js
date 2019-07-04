import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import cx from 'classnames';
import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import Routes from '/src/routes';
import utils from '/src/utils';
import services from '/src/cms/services';
import { Button, Switch, SwitchItem, UserInput } from '/src/cms/components';
import { inputTypes } from '/src/cms/components/user-input/types';
import styles from './styles.scss';
import { hashHistory } from 'react-router';

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      asset: props.asset,
      isValid: false,
    };
    this.validate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!_isEqual(this.props.asset, prevProps.asset)) {
      this.setState({ asset: this.props.asset });
    }
    if (!_isEqual(this.state.asset, prevState.asset)) {
      this.validate();
    }
  }

  getField(key) {
    const { fields } = this.props;
    return fields.find(field => field.key === key);
  }

  resolveValue(value, field) {
    switch (true) {
      case field.type === 'switch':
        return Boolean(value);
      case ['date', 'time', 'date-time'].includes(field.type):
        return value.toDate ? value.toDate() : value;
      default:
        return value || '';
    }
  }

  validate() {
    const { asset } = this.state;
    if (asset) {
      let isValid = true;
      Object.keys(asset).forEach(key => {
        if (!['published', 'id'].includes(key)) {
          const validationFunction = this.resolveValidationFunction(this.getField(key));
          isValid = isValid && validationFunction(asset[key]);
        }
      });
      this.setState({ isValid });
    }
  }

  resolveValidationFunction(field) {
    switch (true) {
      case field.validateWith === 'min-max' && Boolean(field.maxChars && field.minChars):
        return value => (value.length <= field.maxChars && value.length >= field.minChars);
      case field.validateWith === 'min-max' && Boolean(field.maxChars):
        return value => (value.length <= field.maxChars);
      case field.validateWith === 'min-max' && Boolean(field.minChars):
        return value => (value.length >= field.minChars);
      case ['image', 'pdf'].includes(field.type) && field.required:
        return file => (typeof file.name === 'string');
      case field.validateWith === 'date-time':
        return value => (typeof value === 'object');
      case field.validateWith === 'link':
        return utils.validateLink;
      default:
        return () => true;
    }
  }

  onChange(change) {
    this.setState({ asset: Object.assign({}, this.state.asset, change) });
  }

  goBack() {
    const canGoBack = document.referrer.length > 0;
    if (canGoBack) {
      hashHistory.goBack();
    } else {
      hashHistory.push('cms/home');
    }
  }

  handleClickOnDone() {
    this.goBack();
  }

  handleClickOnDelete() {
    this.goBack();
  }

  render() {
    const { fields, collectionId } = this.props;
    const { isValid, asset } = this.state;
    return (Boolean(asset) && Boolean(fields)) ? (
      <div className={cx(styles.assetEditor)} >
        {fields.map(field => {
          const value = this.state.asset[field.key];
          return value !== undefined ? (
            <div key={field.key} className={styles.inputWrapper} >
              <UserInput
                key={field.key}
                placeholder="Type here"
                onChange={value => this.onChange({
                  [field.key]: value,
                })}
                value={this.resolveValue(value, field)}
                label={field.label}
                max={field.maxChars}
                // onValidation={isValid => this.onValidation(field.required ? isValid : true, field.key)}
                disabled={field.disabled}
                required={field.required}
                type={field.type}
                transformer={field.transformer}
                validateWith={this.resolveValidationFunction(field)}
                // options={field.options}
                preserveLineBreaks={field.preserveLineBreaks}
              />
            </div >
          ) : null;
        })}
        {Boolean(asset.published !== undefined) && (
          <Switch indicateIndex={asset.published ? 0 : 1} className={styles.switch} >
            <SwitchItem onClick={() => this.onChange({ published: true })} >Show</SwitchItem >
            <SwitchItem onClick={() => this.onChange({ published: false })} >Hide</SwitchItem >
          </Switch >
        )}
        <Button
          className={styles.footerBtn}
          disable={!isValid}
          onClick={this.handleClickOnDone}
        >
          Done
        </Button >
        {collectionId && (
          <Button
            className={styles.footerBtn}
            type="red"
            onClick={this.handleClickOnDelete}
          >
            Delete
          </Button >
        )}
      </div >
    ) : null;
  }
}

Editor.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    // disabled: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    maxChars: PropTypes.number,
    minChars: PropTypes.number,
    required: PropTypes.bool,
    type: PropTypes.oneOf(inputTypes).isRequired,
    validateWith: PropTypes.string,
  })),
  asset: PropTypes.object,
  collectionId: PropTypes.string,
};

const mapStateToProps = state => ({ // eslint-disable-line
  fields: services.asset.selectors.fields(state),
  asset: services.asset.selectors.item(state),
  collectionId: Routes.selectors.collectionId(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Editor);
