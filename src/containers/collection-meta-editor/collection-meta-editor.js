import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import { Button, UserInput } from '/src/shared';
import services from '/src/services';
import styles from './styles.scss';

class CollectionMetaEditor extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    props.setGoBackPath(`/cms/collection/${props.collectionId}`);
    this.state = {
      newName: '',
      isValid: false,
      working: false,
    };
  }

  handleInputChange(value) {
    this.setState({
      newName: value,
      isValid: value.length > 0,
    });
  }

  rename() {
    this.setState({ working: true });
  }

  render() {
    const { collectionMeta } = this.props;
    const { newName, isValid, working } = this.state;
    return (
      <div className={cx(styles.collectionMetaEditor)} >
        <h2 >Rename {collectionMeta ? collectionMeta.name : ''} to:</h2 >
        <UserInput
          placeholder="New Name"
          onChange={this.handleInputChange}
          value={newName}
          focus
          validateWith={val => val.length > 0}
          className={styles.field}
        />
        <Button
          disable={!isValid || working}
          onClick={this.rename}
        >
          RENAME
        </Button >
      </div >
    );
  }
}

CollectionMetaEditor.propTypes = {
  collectionMeta: PropTypes.object,
  setGoBackPath: PropTypes.func.isRequired,
  collectionId: PropTypes.string,
};

const mapStateToProps = state => ({
  collectionMeta: services.collections.selectors.item(state),
  collectionId: services.router.selectors.collectionId(state),
});

const mapDispatchToProps = dispatch => ({
  setGoBackPath: path => dispatch(services.router.actions.setGoBackPath(path)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(CollectionMetaEditor);
