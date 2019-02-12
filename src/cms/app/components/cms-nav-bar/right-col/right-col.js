import React from 'react';
import { connect } from 'react-redux';
import { Globe } from 'styled-icons/fa-solid/Globe';
import Button from '/src/cms/elements/button';
import { rightCol } from '../../../types';
import Device from '/src/cms/device';
import Auth from '/src/cms/auth';
import { PowerOff } from 'styled-icons/boxicons-regular/PowerOff';
import { hashHistory } from 'react-router';
import styles from './styles.scss';
import { CLIENT_ID } from '/collections.config';

const RightCol = props => (
  <ul className={styles.rightCol} >
    {!props.isMobile && <li className={styles.clientId} >Client-Id: {CLIENT_ID}</li >}
    <li >
      <Button
        color="black-invert"
        linkTo="website/home"
        className={styles.btn}
        justIcon={props.isMobile}
      >
        <Globe />
        {!props.isMobile && <div >Website</div >}
      </Button >
    </li >
    <li >
      <Button
        color="black-invert"
        className={styles.btn}
        justIcon={props.isMobile}
        onClick={() => {
          props.logOut().then(() => {
            hashHistory.push('login');
          });
        }}
      >
        <PowerOff />
        {!props.isMobile && <div >Log Out</div >}
      </Button >
    </li >
  </ul >
);

RightCol.propTypes = rightCol;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(Auth.actions.logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightCol);
