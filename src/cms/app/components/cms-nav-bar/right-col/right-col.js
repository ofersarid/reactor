import React from 'react';
import { connect } from 'react-redux';
import Button from '/src/elements/button';
import { rightCol } from '../../../types';
import Device from '/src/device';
import Auth from '/src/cms/auth';
import { Power } from 'styled-icons/feather/Power';
import { Settings } from 'styled-icons/feather/Settings';
import { hashHistory } from 'react-router';
import Routes from '/src/routes';
import styles from './styles.scss';

const RightCol = props => (
  <ul className={styles.rightCol} >
    <li >
      <Button
        className={styles.btn}
        justIcon
        linkTo="/cms/settings"
        textColor={props.isSettingsPage ? 'green' : null}
      >
        {props.isSettingsPage && <div className={styles.indicator} />}
        <Settings />
      </Button >
    </li >
    <li >
      <Button
        className={styles.btn}
        justIcon
        onClick={() => {
          props.logOut().then(() => {
            hashHistory.push('login');
          });
        }}
      >
        <Power />
      </Button >
    </li >
  </ul >
);

RightCol.propTypes = rightCol;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  isSettingsPage: Routes.selectors.pathname(state) === '/cms/settings',
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(Auth.actions.logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightCol);
