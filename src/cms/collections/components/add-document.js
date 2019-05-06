import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import autoBind from 'auto-bind';
import { FileBlank } from 'styled-icons/boxicons-regular/FileBlank';
import { Dialog, UserInput } from '/src/elements';
import { toTitleCase } from '/src/utils';
import Routes from '/src/routes';
import { addCollectionDialog } from '../types';
import Collections from '../';
// import styles from '../styles.scss';

class AddDocumentDialog extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      newDocumentInputValue: '',
      inputValueIsValid: false,
    };
  }

  createNewDocument() {
    const { newDocumentInputValue, inputValueIsValid } = this.state;
    const { createDoc } = this.props;
    if (inputValueIsValid) {
      createDoc(newDocumentInputValue, { type: 'document' });
    }
  }

  nameIsAlreadyInUse(value) {
    const { userCollections } = this.props;
    const alreadyInUse = userCollections.map(item => item.name);
    return alreadyInUse.includes(value);
  }

  resolveTip() {
    const { newDocumentInputValue } = this.state;
    switch (true) {
      case this.nameIsAlreadyInUse(newDocumentInputValue):
        return `You already have a collection named "${newDocumentInputValue}"`;
      case !newDocumentInputValue.length:
        return 'Please type something';
      case newDocumentInputValue.length > 16:
        return 'To Long...';
      default :
        return 'Looks Good';
    }
  }

  render() {
    const { inputValueIsValid, newDocumentInputValue } = this.state;
    return (
      <Dialog
        size="small"
        header={(
          <Fragment >
            <FileBlank />
            <div >New Document</div >
          </Fragment >
        )}
        actions={[{
          label: 'Save',
          onClick: () => {
            this.createNewDocument();
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
          onChange={value => this.setState({ newDocumentInputValue: toTitleCase(value) })}
          value={newDocumentInputValue}
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

AddDocumentDialog.propTypes = addCollectionDialog;

const mapStateToProps = state => ({
  userCollections: Collections.selectors.userCollections(state),
  pathname: Routes.selectors.pathname(state),
});

const mapDispatchToProps = dispatch => ({
  createDoc: (...props) => dispatch(Collections.actions.createCollection(...props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddDocumentDialog);
