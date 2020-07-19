import React, { PureComponent } from 'react';
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
    const { collectionName, pageName, pathname, devMode } = props;
    this.state = {
      newName: collectionName || pageName || '',
      isValid: false,
      working: false,
      done: false,
      pathname: pathname,
      confirmDelete: false,
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
        pathname: prevState.pathname,
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
    this.setState({
      newName: value,
      isValid: value.length > 0,
    });
  }

  async rename() {
    const { rename, goBackPath } = this.props;
    const { newName } = this.state;
    this.setState({ working: true });
    await rename(newName);
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

  render() {
    const { collectionId, pageName, collectionName } = this.props;
    const { newName, isValid, working, confirmDelete } = this.state;
    return (
      <div className={cx(styles.collectionMetaEditor)} >
        <section >
          <h2 >Rename {collectionName} to:</h2 >
          <UserInput
            placeholder="New Name"
            onChange={this.handleInputChange}
            value={newName}
            focus
            validateWith={val => val.length > 0}
          />
        </section >
        <section >
          <Button
            className={styles.btn}
            disable={!isValid || working}
            onClick={this.rename}
          >
            SAVE
          </Button >
          <Button
            className={styles.btn}
            type="red"
            onClick={this.handleClickOnDelete}
          >
            Delete this {collectionId ? 'Collection' : 'Document'}
          </Button >
          {(collectionName || pageName) && (
            <Modal
              options={['yes', 'no']}
              show={confirmDelete}
              onClick={option => {
                if (option === 'yes') {
                  this.handleClickOnDelete();
                } else {
                  this.setState({ confirmDelete: false });
                }
              }}
            >
              {working ? 'working...' : `Are you sure you want to delete ${collectionName || pageName} ?`}
            </Modal >
          )}
        </section >
      </div >
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
  deleteCollection: PropTypes.func.isRequired,
  deletePage: PropTypes.func.isRequired,
  deleteMe: PropTypes.func.isRequired,
  collectionName: PropTypes.string,
  pageName: PropTypes.string,
  devMode: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
  goBackPath: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  collectionId: services.router.selectors.collectionId(state),
  pageId: services.router.selectors.pageId(state),
  collectionName: services.collections.selectors.name(state),
  pageName: services.pages.selectors.name(state),
  devMode: services.app.selectors.devMode(state),
  pathname: services.router.selectors.pathname(state),
  goBackPath: services.router.selectors.goBackPath(state),
});

const mapDispatchToProps = dispatch => ({
  setGoBackPath: path => dispatch(services.router.actions.setGoBackPath(path)),
  renameCollection: newName => dispatch(services.collections.actions.rename(newName)),
  renamePage: newName => dispatch(services.pages.actions.rename(newName)),
  deleteCollection: id => dispatch(services.collections.actions.remove(id)),
  deletePage: id => dispatch(services.pages.actions.remove(id)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  rename: newName => {
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
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
)(ColPageSettings);
