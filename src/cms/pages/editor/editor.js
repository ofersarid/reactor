import React, { PureComponent } from 'react';
// import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { UserInput } from '/src/cms/components';
import { inputTypes } from '/src/cms/components/user-input/types';
import styles from './styles.scss';

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

  resolveValue(value, field) {
    switch (true) {
      case Boolean(value && value.toDate):
        return value.toDate();
      case field.type === 'switch':
        return Boolean(value);
      default:
        return value;
    }
  }

  // resolveValidationFunction(validationType) {
  //   switch (validationType) {
  //     case 'min-max':
  //       return
  //   }
  // }

  onChange(change) {
    this.setState({ entity: Object.assign({}, this.state.entity, change) });
  }

  render() {
    const { fields } = this.props;
    // const { isValid, entity } = this.state;
    return (
      <div className={cx(styles.assetEditor)} >
        {fields.map((field, i) => {
          const value = this.state.entity[field.key];
          return (
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
                // validateWith={this.resolveValidationFunction(field.validateWith)}
                // options={field.options}
                autoFocus={i === 0}
              />
            </div >
          );
        })}
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
    required: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(inputTypes).isRequired,
    validateWith: PropTypes.string,
  })).isRequired,
  entity: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
  fields: [{
    disabled: false,
    key: 'cover-tagline',
    label: 'Cover Tagline',
    maxChars: 70,
    required: true,
    type: 'multi-line',
    validateWith: 'min-max'
  }],
  entity: ownProps.fields ? ownProps.fields.reduce((entity, field) => {
    switch (true) {
      case field.initialValue !== undefined:
        entity[field.key] = field.initialValue;
        return entity;
      case field.type === 'date-time':
        entity[field.key] = new Date();
        return entity;
      case field.key === 'published':
        entity[field.key] = false;
        return entity;
      // case field.key === 'displayOrder':
      //   entity[field.key] = list.length + 1;
      //   return entity;
      default:
        entity[field.key] = '';
        return entity;
    }
  }, {}) : {},
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Editor);
