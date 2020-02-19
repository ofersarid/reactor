import React, { Fragment } from 'react';
import cx from 'classnames';
import { firestoreConnect } from 'react-redux-firebase';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { compose } from 'redux';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import JSON5 from 'json5';
import animateScrollTo from 'animated-scroll-to';
import { Button, UserInput } from '/src/shared';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import services from '/src/services';
import styles from './styles.scss';

const resolveLinkTo = (listType, itmId,) => {
  switch (listType) {
    case 'collections':
      return `cms/collection/${itmId}`;
    case 'pages':
      return `/cms/page/${itmId}/editor`;
    default:
      return '';
  }
};

const SortableItem = SortableElement(({ children, className }) => <li className={cx(styles.listItemWrap, className)} >{children}</li >);

const SortableList = SortableContainer((
  { items, _ref, name, devMode, className, itemClassName }) => {
  return (
    <ul ref={_ref} className={cx(styles.listContainer, className)} >
      {items.map((itm, i) => (
        <SortableItem key={`item-${itm.id}`} index={i} className={itemClassName} >
          <Button
            linkTo={resolveLinkTo(name, itm.id)}
            justifyContent="start"
          >
            {itm.name}
          </Button >
        </SortableItem >
      ))}
    </ul >
  );
});

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showInputField: false,
      inputValue: '',
      isValid: false,
      working: false,
      sorting: false,
    };
    props.updateAppTitle('REACTOR');
    this.ref = {
      collectionList: React.createRef(),
      pageList: React.createRef(),
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { listName, state } = this.props;
    if (prevProps.listName !== listName || prevProps.state !== state) {
      this.resetListScrollPosition(listName);
    }
  }

  resetListScrollPosition(listName) {
    animateScrollTo(0, {
      elementToScroll: listName === 'collections' ? this.ref.collectionList.current : this.ref.pageList.current,
      minDuration: 1000,
    });
  }

  handleInputChange(val) {
    this.setState({
      inputValue: val,
      isValid: val.trim().length > 0,
    });
  }

  async create() {
    const { createCollection, createPage, listName, clearState } = this.props;
    const { inputValue } = this.state;
    this.setState({
      working: true,
    });
    clearState();
    await listName === 'collections' ? createCollection(inputValue) : createPage(inputValue);
    setTimeout(() => {
      this.setState({
        inputValue: '',
        working: false,
      });
    });
  }

  onSortStart() {
    this.setState({ sorting: true });
  }

  async onSortEnd(sorted) {
    const { listName, collectionsOrder, sortCollections, pagesOrder, sortPages } = this.props;
    const order = listName === 'collections' ? collectionsOrder : pagesOrder;
    console.log(order);
    const moveMe = order[sorted.oldIndex];
    order.splice(sorted.oldIndex, 1);
    order.splice(sorted.newIndex, 0, moveMe);
    console.log(order);
    await listName === 'collections' ? sortCollections(order) : sortPages(order);
    this.setState({ sorting: false });
  }

  render() {
    const { listName, collections, pages, devMode, state } = this.props;
    const { showInputField, inputValue, isValid, working } = this.state;
    const relevantCollections = sortBy(collections, item => JSON5.parse(item.schema).length || devMode);
    const relevantPages = sortBy(pages, item => (item.schema && JSON5.parse(item.schema).length) || devMode);
    return (
      <Fragment >
        <SortableList
          items={relevantCollections || []}
          onSortEnd={this.onSortEnd}
          pressDelay={300}
          transitionDuration={500}
          lockToContainerEdges
          helperClass={styles.dragging}
          onSortStart={this.onSortStart}
          lockAxis="y"
          name="collections"
          devMode={devMode}
          _ref={this.ref.collectionList}
          className={cx(styles.listContainer, {
            [styles.focus]: listName === 'collections' && state !== 'add',
          })}
        />
        <SortableList
          items={relevantPages || []}
          onSortEnd={this.onSortEnd}
          pressDelay={300}
          transitionDuration={500}
          lockToContainerEdges
          helperClass={styles.dragging}
          onSortStart={this.onSortStart}
          lockAxis="y"
          name="pages"
          devMode={devMode}
          _ref={this.ref.pageList}
          className={cx(styles.listContainer, {
            [styles.focus]: listName === 'pages' && state !== 'add',
            [styles.hideLeft]: state === 'add',
          })}
          itemClassName={cx(styles.pageListItemWrap)}
        />
        {devMode && (
          <Fragment >
            <div className={cx(styles.listContainer, styles.addNowList, { [styles.focus]: state === 'add' })} >
              <UserInput
                placeholder={listName === 'collections' ? 'Collection Name' : 'Page Name'}
                onChange={this.handleInputChange}
                value={inputValue}
                focus={showInputField}
                className={cx(styles.listItemWrap, styles.newListItemWrap)}
                validateWith={val => val.length > 0}
              />
              <Button
                className={cx(styles.listItemWrap, styles.newListItemWrap, styles.btn)}
                disable={state === 'add' && (!isValid || working)}
                onClick={this.create}
              >
                CREATE
              </Button >
            </div >
          </Fragment >
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
  collectionsOrder: PropTypes.arrayOf(PropTypes.string),
  pagesOrder: PropTypes.arrayOf(PropTypes.string),
  pages: PropTypes.array,
  updateAppTitle: PropTypes.func.isRequired,
  createCollection: PropTypes.func.isRequired,
  createPage: PropTypes.func.isRequired,
  sortCollections: PropTypes.func.isRequired,
  sortPages: PropTypes.func.isRequired,
  devMode: PropTypes.bool.isRequired,
  clearState: PropTypes.bool.isRequired,
  state: PropTypes.string,
};

const mapStateToProps = state => ({
  listName: services.home.selectors.listName(state),
  prevPath: services.router.selectors.prevPath(state),
  userCollectionIds: services.auth.selectors.userCollectionIds(state),
  userPageIds: services.auth.selectors.userPageIds(state),
  collections: services.collections.selectors.list(state),
  pages: services.pages.selectors.list(state),
  devMode: services.app.selectors.devMode(state),
  collectionsOrder: services.collections.selectors.order(state),
  pagesOrder: services.pages.selectors.order(state),
  state: services.router.selectors.state(state),
});

const mapDispatchToProps = dispatch => ({
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle)),
  createCollection: title => dispatch(services.collections.actions.create(title, [], '', '')),
  createPage: title => dispatch(services.pages.actions.create(title, [])),
  sortCollections: (order) => dispatch(services.collections.actions.sort(order)),
  sortPages: (order) => dispatch(services.pages.actions.sort(order)),
  clearState: () => dispatch(services.router.actions.clearState()),
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
