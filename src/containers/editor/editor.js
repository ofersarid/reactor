import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import JSON5 from 'json5';
import { UnmountClosed } from 'react-collapse';
import autoBind from 'auto-bind';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import utils from '/src/utils';
import services from '/src/services';
import { UserInput } from '/src/shared';
import { inputTypes, fileInputTypes } from '/src/shared/user-input/types';
import EditorFooter from './editor-footer';
import styles from './styles.scss';

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.grouping();
    this.state = {
      asset: props.assetId ? props.asset : {},
      isValid: false,
      deleting: false,
      isWorking: false,
      openGroup: this.groups[1],
    };
    if (props.pageMeta) {
      props.updateAppTitle(props.pageMeta.name);
    }
    if (props.collectionMeta) {
      props.updateAppTitle(props.collectionMeta.name);
    }
  }

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { pageMeta, updateAppTitle, collectionMeta } = this.props;
    if (!this.props.pathname.includes('editor')) {
      return;
    }
    if (!isEqual(this.props.asset, prevProps.asset) && !this.state.deleting) {
      this.setState({ asset: this.props.asset });
    }
    if (!isEqual(this.state.asset, prevState.asset)) {
      this.validate();
    }
    if (this.props.collectionId) {
      this.props.setGoBackPath(`/cms/collection/${this.props.collectionId}`);
      if (!isEqual(prevProps.collectionMeta, collectionMeta)) {
        if (collectionMeta.name) {
          updateAppTitle(collectionMeta.name);
        }
      }
    }
    if (this.props.pageId) {
      this.props.setGoBackPath(`/cms/home`);
      if (!isEqual(prevProps.pageMeta, pageMeta)) {
        if (pageMeta.name) {
          updateAppTitle(pageMeta.name);
        }
      }
    }

    if (this.props.fields.length > 0 && prevProps.fields.length === 0) {
      this.grouping();
      if (this.groups.length > 1 && this.state.openGroup !== this.groups[1]) {
        this.setState({ openGroup: this.groups[1] });
      }
    }
  }

  grouping() {
    const { fields } = this.props;
    this.groups = uniq(fields.reduce((res, fld) => {
      res.push(fld.group);
      if (res.length === 2) {
      }
      return res;
    }, [undefined]));
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
    const { fields } = this.props;
    if (asset) {
      let isValid = true;
      fields.forEach(field => {
        const validationFunction = this.resolveValidationFunction(field);
        isValid = Boolean(isValid && validationFunction(asset[field.key]));
      });
      this.setState({ isValid });
    } else {
      this.setState({ isValid: false });
    }
  }

  resolveValidationFunction(field) {
    if (!field || !field.required) return () => true;
    switch (true) {
      case field.validateWith === 'min-max' && Boolean(field.maxChars && field.minChars):
        return value => Boolean(value && (value.length <= field.maxChars && value.length >= field.minChars));
      case field.validateWith === 'min-max' && Boolean(field.maxChars):
        return value => Boolean(value && ((value.length <= field.maxChars && (field.required ? value.length > 0 : true)) || (!field.required && value.length === 0)));
      case field.validateWith === 'min-max' && Boolean(field.minChars):
        return value => Boolean(value && (value.length >= field.minChars));
      case fileInputTypes.includes(field.type) && field.required:
        return file => Boolean(file && (((typeof file === 'string') && file.length > 0) || (typeof file.name === 'string')));
      case ['date-time', 'date'].includes(field.type):
        return value => (typeof value === 'object' || (!field.required && value && value.length === 0));
      case field.validateWith === 'link' && field.required:
        return value => (utils.validateLink(value)) || (!field.required && value && value.length === 0);
      case field.validateWith === 'email':
        return value => (utils.validateEmail(value)) || (!field.required && value && value.length === 0);
      case field.type === 'multi-select' && field.required:
        return value => Boolean(value && (JSON5.parse(value || '[]').filter(itm => itm.active).length > 0));
      case field.type === 'select' && field.required:
        return value => Boolean(value && value.length > 0);
      default:
        return () => true;
    }
  }

  onChange(change) {
    this.setState({ asset: Object.assign({}, this.state.asset, change) });
  }

  toggleGroup(e) {
    const { openGroup } = this.state;
    const group = e.target.textContent;
    this.setState({ openGroup: openGroup === group ? null : group });
  }

  getReadyForDelete(key) {
    const { deleteFile, asset, save, assetId, pageId } = this.props;
    const doIt = async () => {
      if (asset[`ref--${key}`]) {
        await deleteFile(asset[`ref--${key}`], true);
        const assetCopy = Object.assign({}, asset);
        assetCopy[key] = '';
        assetCopy[`ref--${key}`] = '';
        await save(assetCopy, assetId || pageId);
      }
    };
    doIt();
  }

  render() {
    const { fields } = this.props;
    const { isValid, asset, openGroup } = this.state;
    return (
      <div className={styles.editor} >
        {this.groups.map(groupName => {
          const groupFields = fields.filter(fld => fld.group === groupName);
          return groupFields ? (
            <div key={groupName || 'No Group'} className={styles.groupContainer} >
              {groupName && <div className={styles.divider} onClick={this.toggleGroup} >{groupName}</div >}
              <UnmountClosed isOpened={openGroup === groupName || groupName === 'No Group'} >
                {groupFields.map(field => {
                  const value = asset ? asset[field.key] : undefined;
                  return (
                    <div key={field.key} className={cx(styles.inputWrapper)} >
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
                        options={typeof field.options === 'string' ? JSON5.parse(field.options) : field.options}
                        type={field.type}
                        transformer={field.transformer}
                        validateWith={this.resolveValidationFunction(field)}
                        preserveLineBreaks={field.preserveLineBreaks}
                        remove={fileInputTypes ? () => this.getReadyForDelete(field.key) : undefined}
                      />
                    </div >
                  );
                })}
              </UnmountClosed >
            </div >
          ) : null;
        })}
        <EditorFooter isValid={isValid} asset={asset} onShowHideChange={this.onChange} />
      </div >
    );
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
  goBackPath: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  setGoBackPath: PropTypes.func.isRequired,
  updateAppTitle: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  assetId: PropTypes.string,
  pageMeta: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  collectionMeta: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  save: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ // eslint-disable-line
  fields: services.asset.selectors.fields(state),
  asset: services.asset.selectors.item(state),
  collectionId: services.router.selectors.collectionId(state),
  pageId: services.router.selectors.pageId(state),
  assetId: services.router.selectors.assetId(state),
  goBackPath: services.router.selectors.goBackPath(state),
  pathname: services.router.selectors.pathname(state),
  pageMeta: services.pages.selectors.item(state),
  collectionMeta: services.collections.selectors.item(state),
});

const mapDispatchToProps = dispatch => ({
  setGoBackPath: path => dispatch(services.router.actions.setGoBackPath(path)),
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle)),
  deleteFile: path => dispatch(services.asset.actions.deleteFile(path)),
  save: (asset, assetId) => dispatch(services.asset.actions.save(asset, assetId)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    const connectTo = [];
    if (props.pageId) {
      connectTo.push({
        collection: 'pages',
        doc: props.pageId,
      });
    }
    if (props.collectionId) {
      connectTo.push({
        collection: 'collections',
        doc: props.collectionId,
      });
    }
    if (props.assetId) {
      connectTo.push({
        collection: 'collections',
        doc: props.collectionId,
        subcollections: [{
          collection: 'data',
          doc: props.assetId,
        }],
        storeAs: 'assetEditor',
      });
    }

    return connectTo;
  }),
)(Editor);
