import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Button from '/src/cms/elements/button';
import Device from '/src/cms/device';
import Routes from '/src/routes';
import { Tooltip } from '/src/cms/elements';
import { compose } from 'redux';
import { Collection } from 'styled-icons/boxicons-solid/Collection';
import { Gem } from 'styled-icons/fa-solid/Gem';
import { COLLECTIONS, GENERAL_ASSETS } from '/collections.config';
import styles from './styles.scss';
import { pageList } from '../../../types';
import { sideNavOpen } from '../../../selectors';

const PageList = props => (
  <Fragment >
    <ul className={styles.pageList} >
      {COLLECTIONS.map(collection => {
        const isActive = Boolean(props.pathname.match(`/${collection.id}`));
        return (
          <li key={collection.id} >
            <Button
              linkTo={isActive ? null : `/cms/${collection.id}`}
              className={`waves-color ${styles.navButton}`}
              textColor={isActive ? 'green' : null}
              stretch
            >
              <Tooltip content={!props.sideNavOpen ? collection.name : null} position="right" >
                {collection.icon || <Collection />}
              </Tooltip >
              <div >{collection.name}</div >
              {isActive && (
                <div className={styles.indicator} />
              )}
            </Button >
          </li >
        );
      })}
    </ul >
    <div className={styles.divider} />
    <ul className={styles.pageList} >
      {GENERAL_ASSETS.length > 0 && (
        <li >
          <Button
            linkTo={props.pathname.match('/general-assets') ? null : '/cms/general-assets'}
            className={`waves-color ${styles.navButton}`}
            textColor={props.pathname.match('/general-assets') ? 'green' : null}
            stretch
          >
            <Tooltip content={!props.sideNavOpen ? 'General Assets' : null} position="right" >
              <Gem />
            </Tooltip >
            <div >General</div >
            {props.pathname.match('/general-assets') && (
              <div className={styles.indicator} />
            )}
          </Button >
        </li >
      )}
    </ul >
  </Fragment >
);

PageList.propTypes = pageList;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
  pathname: Routes.selectors.pathname(state),
  isCMS: Routes.selectors.isCMS(state),
  sideNavOpen: sideNavOpen(state),
});

export default compose(
  connect(mapStateToProps, {}),
)(PageList);
