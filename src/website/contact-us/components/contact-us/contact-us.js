import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import Toaster from '/src/cms/elements/toaster';
import autoBind from 'auto-bind';
import ContactForm from '../contacts-form/contact-form';
import { contactUs } from '../../types';

class ContactUs extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showSuccess: false,
      showSending: false,
    };
    this.timeOut = null;
  }

  hideToast() {
    clearTimeout(this.timeOut);
    this.setState({ showSuccess: false });
  }

  showSuccess() {
    this.setState({ showSuccess: true, showSending: false });
    this.timeOut = setTimeout(this.hideToast, 8000);
  }

  showSending() {
    this.setState({ showSending: true });
  }

  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }

  render() {
    const { showSuccess, showSending } = this.state;
    return (
      <Fragment >
        <ContactForm onSend={this.showSending} onSuccess={this.showSuccess} />
        <Toaster show={showSending} type="warning" >
          Sending...
        </Toaster >
        <Toaster show={showSuccess} onClick={this.hideToast} type="success" >
          Thanks! We will get back to you shortly.
        </Toaster >
      </Fragment >
    );
  }
}

ContactUs.propTypes = contactUs;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
