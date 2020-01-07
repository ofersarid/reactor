import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import services from '/src/services';
import { Button, UserInput } from '/src/shared';
import styles from './styles.scss';
import { hashHistory } from 'react-router';

class EditorFooter extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isWorking: false,
      deleting: false,
    };
  }

  componentDidMount() {
    this.$pageContainer = document.getElementsByClassName('pageContainer');
    this.$pageContainer = this.$pageContainer[this.$pageContainer.length - 1];
  }

  handleClickOnDone() {
    const { save, asset, assetId, pageId } = this.props;
    this.setState({ isWorking: true });
    save(asset, assetId || pageId);
    this.goBack();
  }

  goBack() {
    const { goBackPath } = this.props;
    if (goBackPath) {
      hashHistory.push(goBackPath);
    } else {
      hashHistory.push('cms/home');
    }
  }

  handleClickOnDelete() {
    const { deleteAsset, asset, assetId } = this.props;
    this.setState({ deleting: true });
    deleteAsset(asset, assetId);
    this.goBack();
  }

  render() {
    const { asset, isValid, collectionId, onShowHideChange, assetId } = this.props;
    return (
      <div className={cx(styles.editorFooter)} >
        {asset && asset.published !== undefined && (
          <UserInput
            type="switch"
            options={[{ view: 'Show', value: true }, { view: 'Hide', value: false }]}
            value={asset ? Boolean(asset.published) : false}
            onChange={val => onShowHideChange({ published: val })}
            className={styles.switch}
          />
        )}
        <Button
          className={styles.footerBtn}
          disable={!isValid}
          onClick={this.handleClickOnDone}
        >
          Save
        </Button >
        {collectionId && assetId && (
          <Button
            className={styles.footerBtn}
            type="red"
            onClick={this.handleClickOnDelete}
          >
            Delete
          </Button >
        )}
      </div >
    );
  }
}

EditorFooter.propTypes = {
  asset: PropTypes.object,
  isValid: PropTypes.bool.isRequired,
  collectionId: PropTypes.string,
  deleteAsset: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  onShowHideChange: PropTypes.func.isRequired,
  goBackPath: PropTypes.string.isRequired,
  assetId: PropTypes.string,
  pageId: PropTypes.string,
};

const mapStateToProps = state => ({
  collectionId: services.router.selectors.collectionId(state),
  goBackPath: services.router.selectors.goBackPath(state),
  assetId: services.router.selectors.assetId(state),
  pageId: services.router.selectors.pageId(state),
});

const mapDispatchToProps = dispatch => ({
  deleteAsset: (asset, assetId) => dispatch(services.asset.actions.delete(asset, assetId)),
  save: (asset, assetId) => dispatch(services.asset.actions.save(asset, assetId)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(EditorFooter);
