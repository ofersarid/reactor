import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { hashHistory } from 'react-router';
import autoBind from 'auto-bind';
import Device from '/src/device';
import { UserInput, Button } from '/src/elements';
import { Dialog } from '/src/elements/dialog';
import Auth from '/src/cms/auth';
import { Fingerprint } from 'styled-icons/boxicons-regular/Fingerprint';
import { validateEmail } from '/src/utils';
import styles from './styles.scss';

class LoginPage extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      email: '',
      password: '',
    };
  }

  updateState(updatedProps) {
    const newState = Object.assign({}, this.state, updatedProps);
    this.setState(newState);
  }

  redirectAfterLogin() {
    hashHistory.push('/cms');
  }

  componentDidUpdate(prevProps) {
    const { uid } = this.props;
    if (uid && !prevProps.uid) {
      this.redirectAfterLogin();
    }
  }

  render() {
    const { email, password } = this.state;
    const { logIn, authError, uid, deviceType } = this.props;
    return (
      <div className={styles.logInPage} >
        <Dialog
          header={(
            <Fragment >
              <Fingerprint />
              <div >Reactor &mdash; Login</div >
            </Fragment >
          )}
          actions={[{
            label: 'Login',
            onClick: () => {
              return logIn(this.state);
            },
            color: 'green',
            triggerOnEnter: true,
          }]}
          onClose={() => {
            hashHistory.push(uid ? '/cms' : '/home');
          }}
          errorMsg={authError ? authError.message : null}
          className={cx(styles.dialog, styles[`dialog-${deviceType}`])}
        >
          <UserInput
            placeholder="Email"
            onChange={val => this.updateState({ email: val })}
            value={email}
            validateWith={validateEmail}
            className={cx(styles.input, styles[`input-${deviceType}`])}
            onEnterKeyPress={() => logIn(this.state).then(this.redirectAfterLogin)}
          />
          <UserInput
            placeholder="Password"
            onChange={val => this.updateState({ password: val })}
            value={password}
            type="password"
            min={4}
            max={12}
            className={cx(styles.input, styles[`input-${deviceType}`])}
            onEnterKeyPress={() => logIn(this.state).then(this.redirectAfterLogin)}
          />
        </Dialog >
        <Button
          color="white"
          textColor="green"
          className={styles.signUp}
          linkTo="/website/create-account"
        >
          <span>Sign Up Instead...</span>
        </Button>
      </div >
    );
  }
}

LoginPage.propTypes = Auth.types.login;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  authError: Auth.selectors.authError(state),
  working: Auth.selectors.working(state),
  uid: Auth.selectors.uid(state),
});

const mapDispatchToProps = dispatch => ({
  logIn: (...props) => dispatch(Auth.actions.logIn(...props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
