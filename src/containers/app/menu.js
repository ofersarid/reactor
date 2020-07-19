import React, { Fragment } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import services from '/src/services';
import { Button } from '/src/shared';
import { Lock as Locked } from 'styled-icons/boxicons-regular/Lock';
import { LockOpen as Unlocked } from 'styled-icons/boxicons-regular/LockOpen';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const resolveLinkToSchema = (listType, collectionId, pageId) => {
  switch (listType) {
    case 'collections':
      return `/cms/collection/${collectionId}/schema`;
    case 'pages':
      return `/cms/page/${pageId}/schema`;
    default:
      return '';
  }
};

const resolveLinkToRename = (collectionId, pageId) => {
  if (collectionId) {
    return `/cms/collection/${collectionId}/settings`;
  } else if (pageId) {
    return `/cms/page/${pageId}/settings`;
  }
};

const Menu = (
  {
    toggleDevMode,
    devMode,
    toggleMenu,
    listName,
    collectionId,
    pageId,
    pathname,
  }) => (
  <div className={cx(styles.menu)} >
    <section className={styles.menuTopSection} >
      <Button
        type="white"
        className={cx(styles.menuItem, styles.btn)}
        linkTo="/cms/home"
        disable={Boolean(pathname.match(/cms\/home/))}
        onClick={toggleMenu}
      >
        Go Home
      </Button >
    </section >
    <section className={styles.menuBottomSection} >
      <div className={styles.header} >
        <h2 >Developer Area</h2 >
        <div onClick={toggleDevMode} className={cx(styles.lock, { [styles.unlocked]: devMode })} >
          {devMode ? 'Unlocked' : 'Locked'}
          {devMode ? <Unlocked /> : <Locked />}
        </div >
      </div >
      {Boolean(pathname.match('/cms/home')) && (
        <Fragment >
          <Button
            type="white"
            className={cx(styles.menuItem, styles.btn)}
            linkTo="/cms/home/add"
            onClick={toggleMenu}
            disable={!devMode}
          >
            Create a New {listName === 'collections' ? 'Collection' : 'Document'}
          </Button >
        </Fragment >
      )}
      {(collectionId || pageId) && (
        <Fragment>
          <Button
            type="white"
            className={cx(styles.menuItem, styles.btn)}
            linkTo={resolveLinkToSchema(listName, collectionId, pageId)}
            onClick={toggleMenu}
            disable={!devMode || (!collectionId && !pageId)}
          >
            Edit Schema
          </Button >
          <Button
            type="white"
            className={cx(styles.menuItem, styles.btn)}
            linkTo={resolveLinkToRename(collectionId, pageId)}
            onClick={toggleMenu}
            disable={!devMode || (!collectionId && !pageId)}
          >
            {collectionId ? 'Collection' : 'Document'} Settings
          </Button >
        </Fragment>
      )}
    </section >
  </div >
);

Menu.propTypes = {
  menuIsOpen: PropTypes.bool.isRequired,
  toggleDevMode: PropTypes.func.isRequired,
  devMode: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  listName: PropTypes.string.isRequired,
  collectionId: PropTypes.string,
  pageId: PropTypes.string,
  pathname: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  menuIsOpen: services.app.selectors.menuIsOpen(state),
  devMode: services.app.selectors.devMode(state),
  listName: services.home.selectors.listName(state),
  collectionId: services.router.selectors.collectionId(state),
  pageId: services.router.selectors.pageId(state),
  pathname: services.router.selectors.pathname(state),
});

const mapDispatchToProps = dispatch => ({
  toggleDevMode: () => dispatch(services.app.actions.toggleDevMode()),
  toggleMenu: () => dispatch(services.app.actions.toggleMenu()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Menu);
