import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import services from '/src/services';
import { Button, UserInput } from '/src/shared';
import { ChevronUp } from 'styled-icons/boxicons-regular/ChevronUp';
import styles from './styles.scss';
import { hashHistory } from 'react-router';

class EditorFooter extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      show: true,
      isWorking: false,
      deleting: false,
    };
  }

  componentDidMount() {
    this.$pageContainer = document.getElementsByClassName('pageContainer');
    this.$pageContainer = this.$pageContainer[this.$pageContainer.length - 1];
    this.$pageContainer.addEventListener('scroll', this.close);
  }

  componentWillUnmount() {
    this.$pageContainer.removeEventListener('scroll', this.close);
  }

  close() {
    this.setState({ show: false });
  }

  toggleFooter() {
    const { show } = this.state;
    clearTimeout(this.to);
    this.setState({ show: !show });
  }

  handleClickOnDone() {
    const { save, asset } = this.props;
    this.setState({ isWorking: true });
    this.setState({ show: false });
    save(asset).then(this.goBack);
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
    const { deleteAsset, asset } = this.props;
    this.setState({ deleting: true });
    this.setState({ show: false });
    deleteAsset(asset).then(this.goBack);
  }

  render() {
    const { show } = this.state;
    const { asset, isValid, collectionId } = this.props;
    return (
      <div className={cx(styles.editorFooter, { [styles.show]: show })} >
        <Button
          className={cx(styles.footerToggleBtn)}
          onClick={this.toggleFooter}
          type="white"
        >
          <ChevronUp className={cx({ [styles.flip]: show })} />
        </Button >
        {Boolean(asset.published !== undefined) && (
          <UserInput
            type="switch"
            options={[{ view: 'Show', value: true }, { view: 'Hide', value: false }]}
            value={asset.published}
            onChange={val => this.onChange({ published: val })}
            className={styles.switch}
          />
        )}
        <Button
          className={styles.footerBtn}
          disable={!isValid}
          onClick={this.handleClickOnDone}
        >
          Done
        </Button >
        {collectionId && asset.id && (
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
  goBackPath: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  collectionId: services.router.selectors.collectionId(state),
  goBackPath: services.router.selectors.goBackPath(state),
});

const mapDispatchToProps = dispatch => ({
  deleteAsset: asset => dispatch(services.asset.actions.delete(asset)),
  save: asset => dispatch(services.asset.actions.save(asset)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(EditorFooter);
