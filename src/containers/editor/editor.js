import React, { PureComponent, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import JSON5 from 'json5';
import autoBind from 'auto-bind';
import cx from 'classnames';
import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import Routes from '/src/routes';
import { firestoreConnect } from 'react-redux-firebase';
import utils from '/src/utils';
import services from '/src/services';
import { Button, UserInput } from '/src/shared';
import { inputTypes } from '/src/shared/user-input/types';
import styles from './styles.scss';
import { hashHistory } from 'react-router';

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      asset: props.asset,
      isValid: false,
      deleting: false,
      isWorking: false,
    };
    // if (props.collectionId) {
    //   props.setGoBackPath(`/cms/collection/${props.collectionId}`);
    // } else {
    //   props.setGoBackPath(`/cms/home`);
    // }
    if (props.pageMeta) {
      props.updateAppTitle(props.pageMeta.name);
    }
    if (props.collectionMeta) {
      props.updateAppTitle(props.collectionMeta.name);
    }
    // if (!props.collectionMeta && !props.pageMeta) {
    //   this.goBack();
    // }
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.pathname.includes('editor')) {
      return;
    }
    if (!_isEqual(this.props.asset, prevProps.asset) && !this.state.deleting) {
      this.setState({ asset: this.props.asset });
    }
    if (!_isEqual(this.state.asset, prevState.asset)) {
      this.validate();
    }
    if (!prevProps.pageMeta && this.props.pageMeta) {
      this.props.updateAppTitle(this.props.pageMeta.name);
    }
    if (!prevProps.collectionMeta && this.props.collectionMeta) {
      this.props.updateAppTitle(this.props.collectionMeta.name);
    }
    if (this.props.collectionId) {
      this.props.setGoBackPath(`/cms/collection/${this.props.collectionId}`);
    }
    if (this.props.pageId) {
      this.props.setGoBackPath(`/cms/home`);
    }
  }

  getField(key) {
    const { fields } = this.props;
    return fields.find(field => field.key === key);
  }

  resolveValue(value, field) {
    switch (true) {
      case ['date', 'time', 'date-time'].includes(field.type):
        return (value && value.toDate) ? value.toDate() : value;
      default:
        return value;
    }
  }

  validate() {
    const { asset } = this.state;
    if (asset) {
      let isValid = true;
      Object.keys(asset).forEach(key => {
        if (!key.match(/^ref--|^published|^id$/)) {
          const validationFunction = this.resolveValidationFunction(this.getField(key));
          isValid = isValid && validationFunction(asset[key]);
        }
      });
      this.setState({ isValid });
    } else {
      this.setState({ isValid: false });
    }
  }

  resolveValidationFunction(field) {
    switch (true) {
      case field.validateWith === 'min-max' && Boolean(field.maxChars && field.minChars):
        return value => (value.length <= field.maxChars && value.length >= field.minChars);
      case field.validateWith === 'min-max' && Boolean(field.maxChars):
        return value => (value.length <= field.maxChars);
      case field.validateWith === 'min-max' && Boolean(field.minChars):
        return value => (value.length >= field.minChars);
      case ['image', 'pdf'].includes(field.type) && field.required:
        return file => (((typeof file === 'string') && file.length > 0) || (typeof file.name === 'string'));
      case field.validateWith === 'date-time':
        return value => (typeof value === 'object');
      case field.validateWith === 'link':
        return utils.validateLink;
      default:
        return () => true;
    }
  }

  onChange(change) {
    this.setState({ asset: Object.assign({}, this.state.asset, change) });
  }

  goBack() {
    const { goBackPath } = this.props;
    if (goBackPath) {
      hashHistory.push(goBackPath);
    } else {
      hashHistory.push('cms/home');
    }
  }

  handleClickOnDone() {
    const { save } = this.props;
    const { asset } = this.state;
    this.setState({ isWorking: true });
    save(asset).then(this.goBack);
  }

  handleClickOnDelete() {
    const { deleteAsset } = this.props;
    const { asset } = this.state;
    this.setState({ deleting: true });
    deleteAsset(asset).then(this.goBack);
  }

  render() {
    const { fields, collectionId } = this.props;
    const { isValid, asset } = this.state;
    const groups = [];
    return (Boolean(asset) && Boolean(fields)) ? (
      <div className={cx(styles.assetEditor)} >
        {fields.map(field => {
          const value = this.state.asset[field.key];
          const dom = <Fragment key={field.key} >
            {groups.slice(-1)[0] !== field.group ? <div className={styles.divider} >{field.group}</div > : null}
            <div className={styles.inputWrapper} >
              <UserInput
                key={field.key}
                _key={field.key}
                placeholder="Type here"
                onChange={value => this.onChange({
                  [field.key]: field.type === 'multi-select' ? JSON5.stringify(value) : value,
                })}
                value={this.resolveValue(value, field)}
                label={field.label}
                max={field.maxChars}
                // onValidation={isValid => this.onValidation(field.required ? isValid : true, field.key)}
                disabled={field.disabled}
                required={field.required}
                options={field.options}
                type={field.type}
                transformer={field.transformer}
                validateWith={this.resolveValidationFunction(field)}
                preserveLineBreaks={field.preserveLineBreaks}
              />
            </div >
          </Fragment >;
          if (!groups.includes(field.group)) {
            groups.push(field.group);
          }
          return dom;
        })}
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
    ) : null;
  }
}

Editor.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    // disabled: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    maxChars: PropTypes.number,
    minChars: PropTypes.number,
    required: PropTypes.bool,
    type: PropTypes.oneOf(inputTypes).isRequired,
    validateWith: PropTypes.string,
  })),
  asset: PropTypes.object,
  collectionId: PropTypes.string,
  pageId: PropTypes.string,
  save: PropTypes.func.isRequired,
  goBackPath: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  setGoBackPath: PropTypes.func.isRequired,
  deleteAsset: PropTypes.func.isRequired,
  updateAppTitle: PropTypes.func.isRequired,
  assetId: PropTypes.string,
  pageMeta: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  collectionMeta: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = state => ({ // eslint-disable-line
  fields: services.asset.selectors.fields(state),
  asset: services.asset.selectors.item(state),
  collectionId: Routes.selectors.collectionId(state),
  pageId: Routes.selectors.pageId(state),
  assetId: Routes.selectors.assetId(state),
  goBackPath: Routes.selectors.goBackPath(state),
  pathname: Routes.selectors.pathname(state),
  pageMeta: services.pages.selectors.item(state),
  collectionMeta: services.collections.selectors.item(state),
});

const mapDispatchToProps = dispatch => ({
  save: asset => dispatch(services.asset.actions.save(asset)),
  deleteAsset: asset => dispatch(services.asset.actions.delete(asset)),
  setGoBackPath: path => dispatch(Routes.actions.setGoBackPath(path)),
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    return props.collectionId ? [{
      collection: 'collections',
      doc: props.collectionId,
    }, {
      collection: 'collections',
      doc: props.collectionId,
      subcollections: [{
        collection: 'data',
        doc: props.assetId,
      }],
    }] : props.pageId ? [{
      collection: 'pages',
      doc: props.pageId,
    }] : [];
  }),
)(Editor);
