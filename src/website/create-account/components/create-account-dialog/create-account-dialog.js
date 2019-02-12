import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import autoBind from 'auto-bind';
import { Button, UserInput } from '/src/cms/elements';
import { toTitleCase, validateEmail } from '/src/cms/utils';
import difference from 'lodash/difference';
import * as actions from '../../actions';
import styles from './styles.scss';
import { createAccountDialog } from '../../types';

class CreateAccountDialog extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.validatedFields = [];
    this.fields = {
      name: '',
      email: '',
      password: '',
      companyName: '',
      websiteURL: '',
    };
    this.state = {
      ...this.fields,
      isValid: false,
      showSuccess: false,
      showSending: false,
    };
    this.defaultState = this.state;
    this.nameRef = React.createRef();
    this.emailRef = React.createRef();
    this.companyNameRef = React.createRef();
    this.websiteURLRef = React.createRef();
    this.industryRef = React.createRef();
  }
  componentDidUpdate() {
    this.validate();
  }

  validate() {
    const diff = difference(Object.keys(this.fields), this.validatedFields);
    const isValid = !diff.length;
    this.setState({ isValid });
  }

  onValidation(field, isValid) {
    const filedFound = this.validatedFields.includes(field);
    if (isValid && !filedFound) {
      this.validatedFields.push(field);
    } else if (!isValid && filedFound) {
      this.validatedFields = difference(this.validatedFields, [field]);
    }
    this.validate();
  }

  onChange(change) {
    this.setState(Object.assign({}, this.state, change));
  }

  clearForm() {
    this.setState(this.defaultState);
    this.nameRef.current.hideValidation();
    this.emailRef.current.hideValidation();
    this.companyNameRef.current.hideValidation();
    this.websiteURLRef.current.hideValidation();
  }

  hideToast() {
    clearTimeout(this.timeOut);
    this.setState({ showSuccess: false });
  }

  showSuccess() {
    this.setState({ showSuccess: true, showSending: false });
    this.timeOut = setTimeout(() => {
      this.hideToast();
      this.clearForm();
    }, 8000);
  }

  showSending() {
    this.setState({ showSending: true });
  }

  render() {
    const { name, email, companyName, isValid, websiteURL, password } = this.state;
    const { setUpAccount } = this.props;
    return (
      <div className={styles.createAccountDialog} >
        <section className={styles.info} >
          <UserInput
            placeholder="Name"
            onChange={value => this.onChange({ name: toTitleCase(value) })}
            value={name}
            min={1}
            getRef={this.nameRef}
            onValidation={isValid => this.onValidation('name', isValid)}
          />
          <UserInput
            placeholder="Email"
            onChange={value => this.onChange({ email: value })}
            value={email}
            min={1}
            getRef={this.emailRef}
            validateWith={validateEmail}
            onValidation={isValid => this.onValidation('email', isValid)}
          />
          <UserInput
            placeholder="Password"
            onChange={val => this.onChange({ password: val })}
            value={password}
            type="password"
            min={4}
            max={12}
            onValidation={isValid => this.onValidation('password', isValid)}
          />
          <UserInput
            placeholder="Company Name"
            onChange={value => this.onChange({ companyName: value })}
            value={companyName}
            min={1}
            getRef={this.companyNameRef}
            onValidation={isValid => this.onValidation('companyName', isValid)}
          />
          <UserInput
            placeholder="Website URL"
            onChange={value => this.onChange({ websiteURL: value })}
            value={websiteURL}
            min={1}
            getRef={this.websiteURLRef}
            onValidation={isValid => this.onValidation('websiteURL', isValid)}
          />
          <Button
            stretch
            color="green"
            className={styles.sendBtn}
            disable={!isValid}
            onClick={() => {
              setUpAccount(this.state);
            }}
          >
            SEND
          </Button>
        </section>
        <section className={styles.confirmation}></section>
      </div >
    );
  }
}

CreateAccountDialog.propTypes = createAccountDialog;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

const mapDispatchToProps = dispatch => ({
  setUpAccount: info => dispatch(actions.setUpAccount(info))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountDialog);
