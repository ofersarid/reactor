import React, { Fragment, PureComponent } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Device from '/src/device';
import autoBind from 'auto-bind';
import { UserInput, Button, Dialog } from '/src/elements';
import Routes from '/src/routes/index';
import { toTitleCase } from '/src/utils';
import Collections from '/src/cms/collections';
import { FilePlus } from 'styled-icons/feather/FilePlus';
import styles from './styles.scss';
import CollectionList from './collection-list/collection-list';
import logo from './logo.svg';
import { toggleSideNav } from '../../actions';
import { sideNavOpen } from '../../selectors';
import { sideNav } from './types';

class SideNav extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      newCollectionInputValue: '',
      inputValueIsValid: false,
      openAddCollectionDialog: false,
    };

    this.inputRef = React.createRef();
  }

  componentDidMount() {
    const { isMobile, toggleSideNav } = this.props;
    if (isMobile) {
      toggleSideNav();
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

  createNewDoc() {
    const { newCollectionInputValue, inputValueIsValid } = this.state;
    const { createDoc } = this.props;
    if (inputValueIsValid) {
      createDoc(newCollectionInputValue);
    }
    this.inputRef.current.hideValidation();
    this.inputRef.current.$input.current.blur();
    this.setState({ newCollectionInputValue: '' });
  }

  openAddCollectionDialog() {
    this.setState({ openAddCollectionDialog: true });
  }

  render() {
    const { newCollectionInputValue, openAddCollectionDialog, inputValueIsValid } = this.state;
    return (
      <div className={cx(styles.sideNav)} >
        <div >
          <img className={styles.logo} src={logo} />
          <CollectionList />
        </div >
        <div >
          <Button
            color="green"
            stretch
            className={styles.addCollectionBtn}
            onClick={this.openAddCollectionDialog}
          >
            <FilePlus />
          </Button>
          {openAddCollectionDialog && (
            <Dialog
              size="small"
              header={(
                <Fragment >
                  <FilePlus />
                  <div >New Collection / Document</div >
                </Fragment >
              )}
              actions={[{
                label: 'Save',
                onClick: () => {
                  this.createNewDoc();
                },
                closeDialog: true,
                color: 'green',
                triggerOnEnter: true,
                disable: !inputValueIsValid,
              }]}
              onClose={() => {
                this.setState({ openAddCollectionDialog: false });
              }}
            >
              <UserInput
                className={styles.newCollectionInputWrap}
                placeholder="Name It..."
                onChange={value => this.setState({ newCollectionInputValue: toTitleCase(value) })}
                value={newCollectionInputValue}
                min={1}
                max={16}
                validateWith={value => value.length > 0 && value.length < 16 && !this.nameIsAlreadyInUse(value)}
                validationTip={this.resolveTip()}
                blackList={['products']}
                onValidation={isValid => this.setState({ inputValueIsValid: isValid })}
              />
            </Dialog>
          )}
        </div >
      </div >
    );
  }
}

SideNav.propTypes = sideNav;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  sideNavOpen: sideNavOpen(state),
  pathname: Routes.selectors.pathname(state),
  userCollections: Collections.selectors.userCollections(state),
});

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
  createDoc: name => dispatch(Collections.actions.createDoc(name)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SideNav);
