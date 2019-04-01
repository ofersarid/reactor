import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Device from '/src/device';
import autoBind from 'auto-bind';
import { compose } from 'redux';
import { UserInput } from '/src/elements';
import Button from '/src/elements/button';
import { validateEmail, toTitleCase } from '/src/cms/utils';
import { createContact } from './actions';
import { contactForm } from '../../types';
import styles from './styles.scss';

class ContactForm extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      name: '',
      email: '',
      message: '',
      options: {},
      isValid: false,
    };
    this.defaultState = this.state;
    this.validatedFields = [];
    this.nameRef = React.createRef();
    this.emailRef = React.createRef();
  }

  componentDidUpdate() {
    this.validate();
  }

  validate() {
    const { name, email } = this.state;
    const isValid = name.length > 0 && validateEmail(email);
    this.setState({ isValid });
  }

  onChange(change) {
    this.setState(Object.assign({}, this.state, change));
  }

  clearForm() {
    this.setState(this.defaultState);
    this.nameRef.current.hideValidation();
    this.emailRef.current.hideValidation();
  }

  render() {
    const { name, email, message, isValid, options } = this.state;
    const { onSend, onSuccess } = this.props;
    return (
      <div className={styles.formContainer}>
        <UserInput
          placeholder="Required"
          onChange={value => this.onChange({
            name: toTitleCase(value),
          })}
          value={name}
          label="Name"
          min={1}
          getRef={this.nameRef}
        />
        <UserInput
          placeholder="Required"
          onChange={value => this.onChange({
            email: value,
          })}
          value={email}
          label="Email"
          min={1}
          getRef={this.emailRef}
          validateWith={validateEmail}
        />
        <UserInput
          placeholder="Tell us about it..."
          onChange={value => this.onChange({
            message: value,
          })}
          value={message}
          label="Message"
          type="multi-line"
          optional
        />
        <Button
          stretch
          color="green"
          className={styles.sendBtn}
          disable={!isValid}
          onClick={() => {
            onSend();
            this.props.createContact(name, email, message, options).then(() => {
              onSuccess();
              this.clearForm();
            });
          }}
        >
          SEND
        </Button>
      </div>
    );
  }
}

ContactForm.propTypes = contactForm;

const mapStateToProps = (state, ownProps) => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

const mapDispatchToProps = (dispatch) => ({
  createContact: (...props) => dispatch(createContact(...props)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ContactForm);
