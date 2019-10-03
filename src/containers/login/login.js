import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import autoBind from 'auto-bind';
import services from '/src/services';
import { UserInput, Button } from '/src/shared';
import { validateEmail } from '/src/utils';
import styles from './styles.scss';
import PropTypes from 'prop-types';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      email: '',
      password: '',
      valid: false,
    };
  }

  componentDidUpdate() {
    this.validate();
  }

  updateState(updatedProps) {
    const newState = Object.assign({}, this.state, updatedProps);
    this.setState(newState);
  }

  logIn() {
    const { logIn } = this.props;
    logIn(this.state);
  }

  validate() {
    const { email, password } = this.state;
    this.setState({
      valid: (validateEmail(email) && password.length >= 4),
    });
  }

  render() {
    const { email, password, valid } = this.state;
    const { deviceType } = this.props;
    // const { logIn, authError, uid, deviceType } = this.props;
    return (
      <Fragment >
        {/* <SplashScreen > */}
        {/*  <div className={styles.welcomeSplash} > */}
        {/*    WELCOME TO<br /> REACTOR */}
        {/*  </div > */}
        {/* </SplashScreen > */}
        <div className={styles.logInForm} >
          <div className={styles.top} >
            <UserInput
              placeholder="Email"
              onChange={val => this.updateState({ email: val })}
              value={email}
              validateWith={validateEmail}
              className={cx(styles.mb, styles[`input-${deviceType}`])}
              onEnterKeyPress={this.logIn}
            />
            <UserInput
              placeholder="Password"
              onChange={val => this.updateState({ password: val })}
              value={password}
              type="password"
              min={4}
              max={12}
              className={cx(styles[`input-${deviceType}`])}
              onEnterKeyPress={this.logIn}
            />
          </div >
          <Button
            disable={!valid}
            onClick={this.logIn}
          >
            <span >LOG IN</span >
          </Button >
        </div >
      </Fragment >
    );
  }
}

Login.propTypes = {
  deviceType: PropTypes.oneOf(['tablet', 'desktop', 'mobile']),
  logIn: PropTypes.func.isRequired,
  authError: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  working: PropTypes.bool.isRequired,
  uid: PropTypes.string,
};

const mapStateToProps = state => ({
  deviceType: services.device.selectors.type(state),
  authError: services.auth.selectors.authError(state),
  working: services.auth.selectors.working(state),
  uid: services.auth.selectors.uid(state),
});

const mapDispatchToProps = dispatch => ({
  logIn: (...props) => dispatch(services.auth.actions.logIn(...props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
