import React from 'react';
import { connect } from 'react-redux';
import Button from '/src/elements/button';
import { rightCol } from '../../../types';
import Device from '/src/device';
import Auth from '/src/cms/shared/auth';
import { PowerOff } from 'styled-icons/boxicons-regular/PowerOff/PowerOff';
import { Cog } from 'styled-icons/boxicons-regular/Cog/Cog';
import { Collection } from 'styled-icons/boxicons-regular/Collection/Collection';
import { FileBlank } from 'styled-icons/boxicons-regular/FileBlank/FileBlank';
import { hashHistory } from 'react-router';
import Routes from '/src/routes';
import styles from './styles.scss';

const RightCol = props => (
  <ul className={styles.rightCol} >
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
        <PowerOff />
      </Button >
    </li >
    <li >
      <Button
        className={styles.btn}
        justIcon
        linkTo="/cms/settings"
        textColor={props.isSettingsPage ? 'active' : null}
      >
        {props.isSettingsPage && <div className={styles.indicator} />}
        <Cog />
      </Button >
    </li >
    <li >
      <Button
        className={styles.btn}
        justIcon
        linkTo="/cms/add-collection"
        tip="New Collection"
      >
        <Collection />
      </Button >
    </li >
    <li >
      <Button
        className={styles.btn}
        justIcon
        linkTo="/cms/add-document"
        tip="New Document"
      >
        <FileBlank />
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
