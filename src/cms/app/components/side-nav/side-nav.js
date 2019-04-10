import React, { PureComponent } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Device from '/src/device';
import autoBind from 'auto-bind';
import { UserInput } from '/src/elements';
import Routes from '/src/routes/index';
import { toTitleCase } from '/src/utils';
import Collections from '/src/cms/collections';
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
        return 'This name is already in use';
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

  render() {
    const { newCollectionInputValue } = this.state;
    return (
      <div className={cx(styles.sideNav)} >
        <div >
          <img className={styles.logo} src={logo} />
          <CollectionList />
        </div >
        <div >
          <UserInput
            className={styles.newCollectionInputWrap}
            placeholder="New Document"
            onChange={value => this.setState({ newCollectionInputValue: toTitleCase(value) })}
            value={newCollectionInputValue}
            min={1}
            max={16}
            validateWith={value => value.length > 0 && value.length < 16 && !this.nameIsAlreadyInUse(value)}
            validationTip={this.resolveTip()}
            blackList={['products']}
            getRef={this.inputRef}
            onValidation={isValid => this.setState({ inputValueIsValid: isValid })}
            onEnterKeyPress={this.createNewDoc}
            onBlur={this.createNewDoc}
          />
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
