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
    if (!value) return '';
    switch (true) {
      case Boolean(value && value.toDate):
        return value.toDate();
      case field.type === 'switch':
        return Boolean(value);
      default:
        return value;
    }
  }

  resolveValidationFunction(field) {
    switch (field.validateWith) {
      case 'min-max':
        field.minChars = field.required ? (field.minChars || 1) : undefined;
        switch (true) {
          case Boolean(field.maxChars && field.minChars):
            return value => (value.length <= field.maxChars && value.length >= field.minChars);
          case Boolean(field.maxChars):
            return value => (value.length <= field.maxChars);
          case Boolean(field.minChars):
            return value => (value.length >= field.minChars);
          default:
            return () => true;
        }
    }
  }

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
                validateWith={this.resolveValidationFunction(field)}
                // options={field.options}
                preserveLineBreaks={field.preserveLineBreaks}
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
    key: 'cover-tagline',
    label: 'Cover Tagline',
    maxChars: 70,
    required: true,
    type: 'multi-line',
    validateWith: 'min-max',
  }, {
    key: 'frame-1-title',
    label: 'Screen Title',
    maxChars: 50,
    required: true,
    type: 'multi-line',
    validateWith: 'min-max',
  }, {
    key: 'frame-1-body',
    label: 'Body',
    maxChars: 950,
    required: true,
    type: 'multi-line',
    validateWith: 'min-max',
    // eslint-disable-next-line no-irregular-whitespace
    // initialValue: 'Veins are the preferred conduits for peripheral bypass and arterial reconstruction procedures. However, the inherent structural limitations of vein grafts coupled with the hemodynamics of the arterial circulation, result in pathological remodeling and graft failure. When used in lower limb bypass, approximately 20% of vein grafts are occluded at 12 months(1)  and 30%-50% will fail within 3-5 years(2) . months(1)  and 30%-50% will fail within 3-5 years(2). Veins are the preferred conduits for peripheral bypass and arterial reconstruction procedures. However, the inherent structural limitations of vein grafts coupled with the hemodynamics of the arterial circulation, result in pathological remodeling and graft failure. When used in lower limb bypass, approximately 20% of vein grafts are occluded at 12 months(1)  and 30%-50% will fail within 3-5 years(2) . months(1)  and 30%-50% will fail within 3-5 years(2).',
    preserveLineBreaks: true,
  }, {
    key: 'frame-1-footnote-1',
    label: 'Footnote 1',
    maxChars: 210,
    type: 'multi-line',
    validateWith: 'min-max',
  }, {
    key: 'frame-1-footnote-2',
    label: 'Footnote 2',
    maxChars: 210,
    type: 'multi-line',
    validateWith: 'min-max',
  }, {
    key: 'frame-1-footnote-3',
    label: 'Footnote 3',
    maxChars: 210,
    type: 'multi-line',
    validateWith: 'min-max',
  }, {
    key: 'frame-2-title',
    label: 'Screen Title',
    maxChars: 50,
    required: true,
    type: 'multi-line',
    validateWith: 'min-max',
  }, {
    key: 'frame-2-image',
    label: 'Image',
    required: true,
    type: 'image',
  }, {
    key: 'frame-2-subtitle',
    label: 'Image Subtitle',
    maxChars: 50,
    type: 'multi-line',
    validateWith: 'min-max',
  }],
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

const mergeProps = (state, dispatch, own) => {
  const initEntity = () => {
    return state.fields.reduce((entity, field) => {
      switch (true) {
        case field.initialValue !== undefined:
          entity[field.key] = entity[field.key] || field.initialValue;
          return entity;
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
    }, {});
  };

  return Object.assign({}, own, state, {
    entity: own.entity ? own.entity : initEntity(),
  });
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(Editor);
