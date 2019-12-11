import React, { Fragment } from 'react';
import cx from 'classnames';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import { Button, UserInput } from '/src/shared';
import PropTypes from 'prop-types';
import services from '/src/services';
import styles from './styles.scss';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showInputField: false,
      inputValue: '',
      inputType: 'collection',
      isValid: false,
      working: false,
    };
    props.updateAppTitle('Reactor');
  }

  handleInputChange(val) {
    this.setState({
      inputValue: val,
      isValid: val.trim().length > 0,
    });
  }

  handleInputTypeChange(val) {
    this.setState({
      inputType: val,
    });
  }

  async create() {
    const { createCollection, createPage } = this.props;
    const { inputValue, inputType } = this.state;
    this.setState({
      working: true,
    });
    await inputType === 'collection' ? createCollection(inputValue) : createPage(inputValue);
    this.setState({
      showInputField: false,
    });
    setTimeout(() => {
      this.setState({
        inputValue: '',
        working: false,
      });
    });
  }

  render() {
    const { listName, selectList, collections, pages, devMode } = this.props;
    const { showInputField, inputValue, isValid, working, inputType } = this.state;
    const tabs = [{ view: 'Collections', value: 'collections' }, { view: 'Pages', value: 'pages' }];
    if (devMode) {
      tabs.push({
        view: 'New', value: 'new'
      });
    }
    return (
      <Fragment >
        <UserInput
          type="switch"
          options={tabs}
          value={listName}
          onChange={selectList}
          className={styles.tabSection}
        />
        <div
          className={cx(styles.listContainer, {
            [styles.focus]: listName === 'collections',
          })}
        >
          {collections.map(item => (
            <div key={item.id} className={cx(styles.listItemWrap)} >
              <Button
                linkTo={`/cms/collection/${item.id}`}
                type="white"
                justifyContent="start"
              >
                {item.name}
              </Button >
            </div >
          ))}
        </div >
        <div className={cx(styles.listContainer, {
          [styles.focus]: listName === 'pages',
          [styles.hideLeft]: listName === 'new',
        })} >
          {pages.map(item => (
            <div key={item.id} className={cx(styles.listItemWrap, styles.pageListItemWrap)} >
              <Button
                linkTo={`/cms/page/${item.id}/editor`}
                type="white"
                justifyContent="start"
              >
                {item.name}
              </Button >
            </div >
          ))}
        </div >
        {devMode && (
          <div className={cx(styles.listContainer, { [styles.focus]: listName === 'new' })} >
            <UserInput
              type="switch"
              options={[{ view: 'Collection', value: 'collection' }, { view: 'Page', value: 'page' }]}
              value={inputType}
              onChange={this.handleInputTypeChange}
              className={cx(styles.listItemWrap, styles.newListItemWrap, styles.btn)}
            />
            <UserInput
              placeholder={inputType === 'collection' ? 'Collection Name' : 'Page Name'}
              onChange={this.handleInputChange}
              value={inputValue}
              focus={showInputField}
              className={cx(styles.listItemWrap, styles.newListItemWrap)}
            />
            <Button
              className={cx(styles.listItemWrap, styles.newListItemWrap, styles.btn)}
              disable={!isValid || working}
              onClick={this.create}
            >
              CREATE
            </Button >
          </div >
        )}
      </Fragment >
    );
  }
}

Home.propTypes = {
  listName: PropTypes.string.isRequired,
  prevPath: PropTypes.string.isRequired,
  userCollectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  userPageIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  collections: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string.required,
  })),
  pages: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })),
  selectList: PropTypes.func.isRequired,
  updateAppTitle: PropTypes.func.isRequired,
  createCollection: PropTypes.func.isRequired,
  createPage: PropTypes.func.isRequired,
  devMode: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  listName: services.home.selectors.listName(state),
  prevPath: services.router.selectors.prevPath(state),
  userCollectionIds: services.auth.selectors.userCollectionIds(state),
  userPageIds: services.auth.selectors.userPageIds(state),
  collections: services.collections.selectors.list(state),
  pages: services.pages.selectors.list(state),
  devMode: services.app.selectors.devMode(state),
});

const mapDispatchToProps = dispatch => ({
  selectList: (...props) => dispatch(services.home.actions.selectList(...props)),
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle)),
  createCollection: title => dispatch(services.collections.actions.create(title, [], '', '')),
  createPage: title => dispatch(services.pages.actions.create(title, [])),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    let aggregated = [];
    aggregated = aggregated.concat(props.userCollectionIds.reduce((accumulator, id) => {
      accumulator.push({
        collection: 'collections',
        doc: id,
      });
      return accumulator;
    }, []));
    aggregated = aggregated.concat(props.userPageIds.reduce((accumulator, id) => {
      accumulator.push({
        collection: 'pages',
        doc: id,
      });
      return accumulator;
    }, []));
    return aggregated;
  }),
)(Home);
