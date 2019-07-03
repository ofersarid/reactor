import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import cx from 'classnames';
import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import Routes from '/src/routes';
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
      entity: props.entity,
      isValid: false,
    };
    this.validatedFields = [];
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { entity } = this.state;
    let isValid = true;
    Object.keys(entity).forEach(key => {
      if (key !== 'published') {
        const validationFuntion = this.resolveValidationFunction(this.getField(key));
        isValid = isValid && validationFuntion(entity[key]);
      }
    });
    this.setState({ isValid });
    if (!_isEqual(this.props.entity, prevProps.entity)) {
      this.setState({ entity: this.props.entity });
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
        return value.toDate ? value.toDate() : '';
      default:
        return value || '';
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
      case field.validateWith === 'date-time' && field.required:
        return value => (typeof value === 'object');
      default:
        return () => true;
    }
  }

  onChange(change) {
    this.setState({ entity: Object.assign({}, this.state.entity, change) });
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
    const { isValid, entity } = this.state;
    return (
      <div className={cx(styles.assetEditor)} >
        {fields.map(field => {
          const value = this.state.entity[field.key];
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
        {Boolean(entity.published !== undefined) && (
          <Switch indicateIndex={entity.published ? 0 : 1} className={styles.switch} >
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
    );
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
  })).isRequired,
  entity: PropTypes.object,
  collectionId: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
  collectionId: Routes.selectors.collectionId(state),
  pageId: Routes.selectors.pageId(state),
  collection: services.collections.selectors.item(state),
  page: services.collections.selectors.item(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

const mergeProps = (state, dispatch, own) => {
  const fields = state.collection
    ? state.collection.fields
    : state.page
      ? state.page.fields
      : [];

  const initEntity = () => {
    const emptyEntity = {};
    if (state.collectionId) {
      emptyEntity.published = true;
    }

    Object.assign(emptyEntity, fields.reduce((entity, field) => {
      switch (true) {
        case field.type === 'date-time':
          entity[field.key] = entity[field.key] || new Date();
          return entity;
        case field.key === 'published':
          entity[field.key] = entity[field.key] || false;
          return entity;
        // case field.key === 'displayOrder':
        //   entity[field.key] = list.length + 1;
        //   return entity;
        default:
          entity[field.key] = entity[field.key] || '';
          return entity;
      }
    }, {}));

    return emptyEntity;
  };

  return Object.assign({}, own, state, {
    fields,
    entity: state.entity ? state.entity : initEntity(),
  });
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(Editor);
