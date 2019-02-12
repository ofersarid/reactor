import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import Device from '/src/cms/device';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { UserInput, Button } from '/src/cms/elements';
import difference from 'lodash/difference';
import isEqual from 'lodash/isEqual';
import { GENERAL_ASSETS } from '/collections.config';
import { Check } from 'styled-icons/fa-solid/Check';
import { ActivityToaster } from '/src/cms/activity';
import styles from './styles.scss';
import { generalAssets } from '../../../types';
import { updateEntity } from '../../../actions';
import { settings as _settings } from '../../../selectors';

class GeneralAssets extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isValid: false,
      generalAssets: props.settings.generalAssets || this.initFields(),
    };
    this.validatedFields = this.getOptionalFieldsAsList();
  }

  initFields() {
    return GENERAL_ASSETS.reduce((fields, item) => {
      fields[item.key] = item.initialValue !== undefined ? item.initialValue : '';
      return fields;
    }, {});
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate(prevProps, prevSatate) {
    const { settings } = this.props;
    if (!isEqual(settings, prevProps.settings)) {
      this.setState({
        generalAssets: settings.generalAssets,
      });
    }
  }

  onChange(change) {
    this.setState({ generalAssets: Object.assign({}, this.state.generalAssets, change) });
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

  getOptionalFieldsAsList() {
    return GENERAL_ASSETS.reduce((list, field) => {
      if (!field.required) {
        list.push(field.key);
      }
      return list;
    }, []);
  }

  validate() {
    const eFs = GENERAL_ASSETS.map(field => field.key);
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

  shouldUpdateStore() {
    const { generalAssets } = this.props.settings;
    return !isEqual(generalAssets, this.state.generalAssets);
  }

  submit() {
    const { update } = this.props;
    const { generalAssets } = this.state;
    if (this.shouldUpdateStore()) {
      update(generalAssets, 'generalAssets', 'settings');
    }
  }

  render() {
    const { generalAssets, isValid } = this.state;
    const changeDetected = this.shouldUpdateStore();
    return (
      <div className={styles.generalAssets} >
        <div className={styles.body} >
          {GENERAL_ASSETS.map(field => (
            <UserInput
              key={field.key}
              placeholder={field.required ? 'required' : 'optional'}
              type={field.type}
              label={field.label}
              value={this.resolveValue(generalAssets[field.key], field)}
              onChange={value => this.onChange({
                [field.key]: value,
              })}
              onValidation={isValid => this.onValidation(field.required ? isValid : true, field.key)}
              className={styles.input}
            />
          ))}
        </div >
        <div className={styles.footer} >
          <Button
            onClick={this.submit}
            color={isValid ? 'green' : 'red'}
            disable={!isValid || !changeDetected}
          >
            <Check />
            <span >Save</span >
          </Button >
        </div >
        <ActivityToaster />
      </div >
    );
  }
}

GeneralAssets.propTypes = generalAssets;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
  settings: _settings(state),
});

const mapDispatchToProps = dispatch => ({
  update: (...props) => dispatch(updateEntity(...props))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(['settings']),
)(GeneralAssets);
