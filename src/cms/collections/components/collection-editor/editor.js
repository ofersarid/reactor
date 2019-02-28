import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Check } from 'styled-icons/fa-solid/Check';
import { Dialog } from '/src/cms/elements/dialog/index';
import { UserInput } from '/src/cms/elements/index';
import { hashHistory } from 'react-router';
import Device from '/src/cms/device/index';
import { ModeEdit } from 'styled-icons/material/ModeEdit';
import { AddCircle } from 'styled-icons/material/AddCircle';
import Routes from '/src/routes/index';
import autoBind from 'auto-bind';
import isEqual from 'lodash/isEqual';
import difference from 'lodash/difference';
import { compose } from 'redux';
import pluralize from 'pluralize';
import { entityEditor } from '../../types';
import { updateEntity } from '../../actions';
import * as selectors from '../../selectors';

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      entity: props.entity || this.initEmptyEntity(),
      isValid: false,
    };
    this.validatedFields = this.getOptionalFieldsAsList();
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate(prevProps, prevSatate) {
    const { entity, list, isAdd } = this.props;
    if (!isEqual(entity, prevProps.entity)) {
      this.setState({ entity });
      this.validate();
    }
    if (list.length !== prevProps.list.length && isAdd) {
      this.onChange({ displayOrder: list.length + 1 });
    }
  }

  initEmptyEntity() {
    const { collection, list } = this.props;
    return collection.entity.fields.reduce((fields, item) => {
      switch (true) {
        case item.initialValue !== undefined:
          fields[item.key] = item.initialValue;
          return fields;
        case item.type === 'date-time':
          fields[item.key] = new Date();
          return fields;
        case item.key === 'published':
          fields[item.key] = false;
          return fields;
        case item.key === 'displayOrder':
          fields[item.key] = list.length + 1;
          return fields;
        default:
          return fields;
      }
    }, {});
  }

  getOptionalFieldsAsList() {
    const { collection } = this.props;
    return collection.entity.fields.reduce((list, field) => {
      if (!field.required || field.disabled) {
        list.push(field.key);
      }
      return list;
    }, []);
  }

  validate() {
    const { collection } = this.props;
    const eFs = collection.entity.fields.map(field => field.key);
    const diff = difference(eFs, this.validatedFields);
    const isValid = !diff.length;
    this.setState({ isValid });
  }

  onValidation(isValid, field) {
    const filedFound = this.validatedFields.includes(field);
    if (isValid && !filedFound) {
      this.validatedFields.push(field);
      this.validate();
    } else if (!isValid && filedFound) {
      this.validatedFields = difference(this.validatedFields, [field]);
      this.validate();
    }
  }

  onChange(change) {
    this.setState({ entity: Object.assign({}, this.state.entity, change) });
  }

  shouldUpdateStore() {
    const { entity } = this.props;
    return !isEqual(entity, this.state.entity);
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

  render() {
    const { isValid } = this.state;
    const { isAdd, collection, collectionId, list, id, update } = this.props;
    // const id = pathname.split('/').pop();
    return (
      <Dialog
        header={(
          <Fragment >
            {isAdd ? <AddCircle /> : <ModeEdit />}
            <div >{pluralize.singular(collection.name)} Editor</div >
            &nbsp;&mdash;&nbsp;
            <span >{isAdd ? 'add' : 'edit'}</span >
          </Fragment >
        )}
        actions={[{
          label: 'Save',
          onClick: () => {
            if (this.shouldUpdateStore()) {
              update(this.state.entity, id, collectionId);
            }
          },
          closeDialog: true,
          color: isValid ? 'green' : 'red',
          icon: <Check />,
          disable: !isValid,
        }]}
        onClose={() => {
          hashHistory.push(`cms/collections/${collectionId}`);
        }}
      >
        {collection.entity.fields.map(field => {
          const value = this.state.entity[field.key];
          return (
            <UserInput
              key={field.key}
              placeholder={field.required ? 'required' : 'optional'}
              onChange={value => this.onChange({
                [field.key]: value,
              })}
              value={this.resolveValue(value, field)}
              label={field.label}
              min={field.key === 'displayOrder' ? 1 : field.minChars}
              max={field.key === 'displayOrder' ? list.length + 1 : field.maxChars}
              onValidation={isValid => this.onValidation(field.required ? isValid : true, field.key)}
              disabled={field.disabled}
              optional={!field.required}
              type={field.type}
              transformer={field.transformer}
              validateWith={field.validateWith}
              options={field.options}
            />
          );
        })}
      </Dialog >
    );
  }
}

Editor.propTypes = entityEditor;

const mapStateToProps = (state, ownProps) => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
  entity: selectors.entitySelector(state, ownProps.collection, ownProps.route, ownProps.editorFields),
  isAdd: Routes.selectors.isAdd(state),
  pathname: Routes.selectors.pathname(state),
  list: selectors.filteredOrderedList(state),
  collection: selectors.collection(state),
  collectionId: Routes.selectors.collectionId(state),
});

const mapDispatchToProps = dispatch => ({
  update: (...props) => dispatch(updateEntity(...props)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Editor);
