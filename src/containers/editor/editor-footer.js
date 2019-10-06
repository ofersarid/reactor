import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import services from '/src/services';
import { Button } from '/src/shared';
import { ChevronUp } from 'styled-icons/boxicons-regular/ChevronUp';
import { Spring } from 'react-spring/renderprops-universal';
import styles from './styles.scss';
import { hashHistory } from 'react-router';

class EditorFooter extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      immediate: true,
      show: false,
      isWorking: false,
      deleting: false,
    };
  }

  componentDidMount() {
    this.setState({ immediate: false });
  }

  toggleFooter() {
    const { show } = this.state;
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
    const { immediate, show } = this.state;
    const { asset, isValid, collectionId } = this.props;
    const openHeight = collectionId ? 210 : 125;
    return (
      <Spring
        from={{ transform: `translateY(${show ? openHeight : 0}px)` }}
        to={{ transform: `translateY(${show ? 0 : openHeight}px)` }}
        immediate={immediate}
      >
        {springs => <div className={cx(styles.editorFooter)} style={springs} >
          <Button
            className={styles.footerToggleBtn}
            onClick={this.toggleFooter}
            type="white"
          >
            <ChevronUp className={cx({ [styles.flip]: show })} />
          </Button >
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
        </div >}
      </Spring >
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
