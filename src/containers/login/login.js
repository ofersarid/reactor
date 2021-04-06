import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import autoBind from 'auto-bind';
import services from '/src/services';
import { actionTypes } from 'redux-firestore';
import { Lock } from 'styled-icons/boxicons-regular/Lock';
import { LoginCircle } from 'styled-icons/remix-line/LoginCircle';
import { UserInput, Button } from '/src/shared';
import { validateEmail } from '/src/utils';
import styles from './styles.scss';
import logo from '/src/assets/images/logo.svg';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      email: '',
      password: '',
      valid: false,
      emailIsValid: false,
      passwordIsValid: false
    };
  }

  componentDidUpdate(prevProps) {
    const { logOut, pathname, clearData } = this.props;
    if (prevProps.pathname.match('home') && pathname.match(/login/)) {
      logOut();
      clearData();
    }
    this.validate();
  }

  updateState(updatedProps) {
    const newState = Object.assign({}, this.state, updatedProps);
    this.setState(newState);
  }

  logIn() {
    const { valid } = this.state;
    const { logIn } = this.props;
    if (valid) {
      logIn(this.state);
    }
  }

  validate() {
    const { email, password } = this.state;
    this.setState({
      emailIsValid: validateEmail(email),
      passwordIsValid: password.length >= 4,
      valid: validateEmail(email) && password.length >= 4
    });
  }

  render() {
    const { email, password, valid } = this.state;
    const { deviceType, authError } = this.props;
    // const { logIn, authError, uid, deviceType } = this.props;
    return (
      <div className={styles.pageWrap}>
        <img src={logo} />
        <div className={styles.logInForm}>
          <h1>SIGN IN</h1>
          <UserInput
            placeholder='Email'
            onChange={(val) => this.updateState({ email: val })}
            value={email}
            validateWith={validateEmail}
            className={cx(styles.input, styles[`input-${deviceType}`])}
            onEnterKeyPress={this.logIn}
            status='standBy'
          />
          <UserInput
            placeholder='Password'
            onChange={(val) => this.updateState({ password: val })}
            value={password}
            validateWith={(val) => val.length >= 4}
            type='password'
            min={4}
            max={12}
            className={cx(styles.input, styles[`input-${deviceType}`])}
            onEnterKeyPress={this.logIn}
          />
          <div className={styles.iForgot}>I Forgot My Password</div>
          <Button onClick={this.logIn} className={styles.submit}>
            {valid ? (
              <LoginCircle className={styles.loginCircle} />
            ) : (
              <Lock className={styles.lock} />
            )}
          </Button>
          {authError && <div>{authError.message}</div>}
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  deviceType: PropTypes.oneOf(['tablet', 'desktop', 'mobile']),
  logIn: PropTypes.func.isRequired,
  clearData: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  logOut: PropTypes.func.isRequired,
  authError: PropTypes.shape({
    message: PropTypes.string.isRequired
  }),
  working: PropTypes.bool.isRequired,
  uid: PropTypes.string
};

const mapStateToProps = (state) => ({
  deviceType: services.device.selectors.type(state),
  authError: services.auth.selectors.authError(state),
  working: services.auth.selectors.working(state),
  pathname: services.router.selectors.pathname(state),
  uid: services.auth.selectors.uid(state)
});

const mapDispatchToProps = (dispatch) => ({
  logIn: (...props) => dispatch(services.auth.actions.logIn(...props)),
  logOut: (...props) => dispatch(services.auth.actions.logOut(...props)),
  clearData: () =>
    dispatch({
      type: actionTypes.CLEAR_DATA
    })
});

export default compose(
  // services.device.HOC,
  // services.router.HOC,
  // services.auth.HOC,
  connect(mapStateToProps, mapDispatchToProps)
)(Login);
