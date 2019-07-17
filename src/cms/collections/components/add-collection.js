import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import autoBind from 'auto-bind';
import { Collection } from 'styled-icons/boxicons-regular/Collection';
import { Dialog, UserInput } from '/src/elements';
import { toTitleCase } from '/src/utils';
import Routes from '/src/routes';
import { addCollectionDialog } from '../types';
import Collections from '../';
// import styles from '../styles.scss';

class AddCollectionDialog extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      newCollectionInputValue: '',
      inputValueIsValid: false,
    };
  }

  createNewCollection() {
    const { newCollectionInputValue, inputValueIsValid } = this.state;
    const { createDoc } = this.props;
    if (inputValueIsValid) {
      createDoc(newCollectionInputValue, { type: 'collection-assets.js' });
    }
  }

  nameIsAlreadyInUse(value) {
    const { userCollections } = this.props;
    const alreadyInUse = userCollections.map(item => item.name);
    return alreadyInUse.includes(value);
  }

  resolveTip() {
    const { newCollectionInputValue } = this.state;
    switch (true) {
      case this.nameIsAlreadyInUse(newCollectionInputValue):
        return `You already have a collection named "${newCollectionInputValue}"`;
      case !newCollectionInputValue.length:
        return 'Please type something';
      case newCollectionInputValue.length > 16:
        return 'To Long...';
      default :
        return 'Looks Good';
    }
  }

  render() {
    const { inputValueIsValid, newCollectionInputValue } = this.state;
    return (
      <Dialog
        size="small"
        header={(
          <Fragment >
            <Collection />
            <div >New Collection</div >
          </Fragment >
        )}
        actions={[{
          label: 'Save',
          onClick: () => {
            this.createNewCollection();
          },
          closeDialog: true,
          color: 'green',
          triggerOnEnter: true,
          disable: !inputValueIsValid,
        }]}
        onClose={() => {
          hashHistory.push('cms');
        }}
      >
        <UserInput
          placeholder="Name It..."
          onChange={value => this.setState({ newCollectionInputValue: toTitleCase(value) })}
          value={newCollectionInputValue}
          min={1}
          max={16}
          validateWith={value => value.length > 0 && value.length < 16 && !this.nameIsAlreadyInUse(value)}
          validationTip={this.resolveTip()}
          onValidation={isValid => this.setState({ inputValueIsValid: isValid })}
          autoFocus
        />
      </Dialog>
    );
  }
}

AddCollectionDialog.propTypes = addCollectionDialog;

const mapStateToProps = state => ({
  userCollections: Collections.selectors.userCollections(state),
  pathname: Routes.selectors.pathname(state),
});

const mapDispatchToProps = dispatch => ({
  createDoc: name => dispatch(Collections.actions.createCollection(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCollectionDialog);
