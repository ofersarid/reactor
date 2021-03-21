import React, { PureComponent, Fragment } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import { Button, UserInput, Modal } from '/src/shared';
import services from '/src/services';
import styles from './styles.scss';

class ColPageSettings extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    const { collectionName, pageName, pathname, devMode, maxItems } = props;
    this.state = {
      newName: collectionName || pageName || '',
      isValid: false,
      working: false,
      done: false,
      pathname: pathname,
      confirmDelete: false,
      maxItems: maxItems
    };
    const goBackPath = this.getGoBackPath(props);
    props.setGoBackPath(goBackPath);
    if (!devMode) {
      hashHistory.push(goBackPath);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.pathname !== prevState.pathname) {
      return {
        pathname: prevState.pathname
      };
    }
    return {};
  }

  getGoBackPath(props) {
    const { collectionId, pageId } = props;
    if (collectionId) {
      return `cms/collection/${collectionId}`;
    } else if (pageId) {
      return `cms/page/${pageId}/editor`;
    }
    return 'cms/home';
  }

  handleInputChange(value) {
    const { maxItems } = this.state;
    this.setState({
      newName: value,
      isValid: value.length > 0 && (maxItems === '' || maxItems > 0)
    });
  }

  handleMaxItemsInputChange(value) {
    const { newName } = this.state;
    this.setState({
      maxItems: value,
      isValid: newName.length > 0 && (value === '' || value > 0)
    });
  }

  async submitChanges() {
    const { rename, goBackPath, limitItems } = this.props;
    const { newName, maxItems } = this.state;
    this.setState({ working: true });
    await rename(newName);
    await limitItems(maxItems);
    this.setState({ working: false, done: true });
    hashHistory.push(goBackPath);
  }

  async handleClickOnDelete() {
    const { deleteMe } = this.props;
    const { confirmDelete } = this.state;
    if (confirmDelete) {
      this.setState({ working: true });
      await deleteMe();
      hashHistory.push('cms/home');
    } else {
      this.setState({ confirmDelete: true });
    }
  }

  async duplicate() {
    const {
      collectionId,
      collectionName,
      pageId,
      pageName,
      duplicateCollection,
      duplicatePage
    } = this.props;
    let newId;
    newId = collectionId
      ? await duplicateCollection(collectionId, `${collectionName} (duplicate)`)
      : await duplicatePage(pageId, `${pageName} (duplicate)`);
    hashHistory.push(`/cms/${collectionId ? 'collection' : 'page'}/${newId}`);
  }

  getModalText() {
    const { collectionName, pageName } = this.props;
    const { working } = this.state;

    return working
      ? 'working...'
      : `Are you sure you want to delete ${collectionName || pageName} ?`;
  }

  render() {
    const { collectionId, pageName, collectionName } = this.props;
    const { newName, isValid, working, confirmDelete, maxItems } = this.state;
    return (
      <div className={cx(styles.collectionMetaEditor)}>
        <section>
          <h2>Rename {collectionName} to:</h2>
          <UserInput
            placeholder='New Name'
            onChange={this.handleInputChange}
            value={newName}
            focus
            validateWith={(val) => val.length > 0}
          />
          {collectionId && (
            <Fragment>
              <h2 style={{ marginTop: '20px' }}>Max Items</h2>
              <UserInput
                placeholder='&#8734;'
                type='number'
                onChange={this.handleMaxItemsInputChange}
                value={maxItems}
                validateWith={(val) => val > 0}
              />
            </Fragment>
          )}
        </section>
        <section>
          <Button
            className={styles.btn}
            disable={!isValid || working}
            onClick={this.submitChanges}
          >
            SAVE
          </Button>
          <Button
            type='white'
            className={cx(styles.menuItem, styles.btn)}
            onClick={this.duplicate}
          >
            Duplicate {collectionId ? 'Collection' : 'Document'}
          </Button>
          <Button
            className={styles.btn}
            type='red'
            onClick={this.handleClickOnDelete}
          >
            Delete this {collectionId ? 'Collection' : 'Document'}
          </Button>
          {(collectionName || pageName) && (
            <Modal
              options={['yes', 'no']}
              show={confirmDelete}
              onClick={(option) => {
                if (option === 'yes') {
                  this.handleClickOnDelete();
                } else {
                  this.setState({ confirmDelete: false });
                }
              }}
            >
              {this.getModalText()}
            </Modal>
          )}
        </section>
      </div>
    );
  }
}

ColPageSettings.propTypes = {
  setGoBackPath: PropTypes.func.isRequired,
  collectionId: PropTypes.string,
  pageId: PropTypes.string,
  renameCollection: PropTypes.func.isRequired,
  renamePage: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
  limitItems: PropTypes.func.isRequired,
  deleteCollection: PropTypes.func.isRequired,
  deletePage: PropTypes.func.isRequired,
  deleteMe: PropTypes.func.isRequired,
  collectionName: PropTypes.string,
  maxItems: PropTypes.oneOfType([PropTypes.number || PropTypes.string]),
  pageName: PropTypes.string,
  devMode: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
  goBackPath: PropTypes.string.isRequired,
  duplicateCollection: PropTypes.func.isRequired,
  duplicatePage: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  collectionId: services.router.selectors.collectionId(state),
  pageId: services.router.selectors.pageId(state),
  collectionName: services.collections.selectors.name(state),
  maxItems: services.collections.selectors.maxItems(state),
  pageName: services.pages.selectors.name(state),
  devMode: services.app.selectors.devMode(state),
  pathname: services.router.selectors.pathname(state),
  goBackPath: services.router.selectors.goBackPath(state)
});

const mapDispatchToProps = (dispatch) => ({
  setGoBackPath: (path) =>
    dispatch(services.router.actions.setGoBackPath(path)),
  renameCollection: (newName) =>
    dispatch(services.collections.actions.rename(newName)),
  limitItems: (maxItems) =>
    dispatch(services.collections.actions.limitItems(maxItems)),
  renamePage: (newName) => dispatch(services.pages.actions.rename(newName)),
  deleteCollection: (id) => dispatch(services.collections.actions.remove(id)),
  deletePage: (id) => dispatch(services.pages.actions.remove(id)),
  duplicateCollection: (collectionId, newName) =>
    dispatch(services.collections.actions.duplicate(collectionId, newName)),
  duplicatePage: (pageId, newName) =>
    dispatch(services.pages.actions.duplicate(pageId, newName))
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  rename: (newName) => {
    if (stateProps.collectionId) {
      return dispatchProps.renameCollection(newName);
    } else if (stateProps.pageId) {
      return dispatchProps.renamePage(newName);
    }
    return null;
  },
  deleteMe: () => {
    if (stateProps.collectionId) {
      return dispatchProps.deleteCollection(stateProps.collectionId);
    } else if (stateProps.pageId) {
      return dispatchProps.deletePage(stateProps.pageId);
    }
    return null;
  }
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(ColPageSettings);
