import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import autoBind from 'auto-bind';
import { Button, UserInput, Toaster } from '/src/cms/elements';
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
      passwordConfirm: '',
    };
    this.state = {
      ...this.fields,
      isValid: false,
      showSuccess: false,
      showSending: false,
      showPassword: false,
      emailInUse: false,
    };
    this.defaultState = this.state;
    this.nameRef = React.createRef();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.passwordConfirmRef = React.createRef();
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
    this.passwordRef.current.hideValidation();
    this.passwordConfirmRef.current.hideValidation();
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
    const { name, email, passwordConfirm, isValid, password, emailInUse } = this.state;
    const { setUpAccount } = this.props;
    // todo - validate Full Name
    // todo - add show password
    return (
      <div className={styles.createAccountDialog} >
        <section className={styles.info} >
          <UserInput
            placeholder="Full Name"
            onChange={value => this.onChange({ name: toTitleCase(value) })}
            value={name}
            min={1}
            getRef={this.nameRef}
            onValidation={isValid => this.onValidation('name', isValid)}
          />
          <UserInput
            placeholder="Email"
            onChange={value => {
              this.onChange({ email: value });
              this.setState({ emailInUse: false });
            }}
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
            min={6}
            max={12}
            onValidation={isValid => this.onValidation('password', isValid)}
            getRef={this.passwordRef}
          />
          <UserInput
            placeholder="Confirm Password"
            onChange={val => this.onChange({ passwordConfirm: val })}
            value={passwordConfirm}
            type="password"
            validateWith={val => (val === password && val.length >= 6)}
            onValidation={isValid => this.onValidation('passwordConfirm', isValid)}
            getRef={this.passwordConfirmRef}
          />
          <Button
            stretch
            color="green"
            className={styles.sendBtn}
            disable={!isValid}
            onClick={() => {
              setUpAccount(this.state).catch(err => {
                if (err.code === 'auth/email-already-in-use') {
                  this.setState({ emailInUse: true });
                }
              });
            }}
          >
            SEND
          </Button>
        </section>
        <Toaster show={emailInUse} type="error" >
          {email} - already exists. Please
          <Button
            linkTo="cms/login"
            color="white"
            className={styles.login}
          >
            Log In
          </Button >
          instead.
        </Toaster >
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
