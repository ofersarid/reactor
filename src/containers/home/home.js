import React, { Fragment } from 'react';
import cx from 'classnames';
import { Trail, animated, Spring } from 'react-spring/renderprops';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import autoBind from 'auto-bind';
import { connect } from 'react-redux';
import { Add } from 'styled-icons/material';
import { Switch, SwitchItem, Button, UserInput } from '/src/shared';
import PropTypes from 'prop-types';
import services from '/src/services';
import Routes from '/src/routes';
import styles from './styles.scss';
import Auth from '../../shared/auth';

const listToIndex = list => {
  switch (list) {
    case 'pages':
      return 1;
    default:
      return 0;
  }
};

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showInputField: false,
      inputValue: '',
      immediate: true,
    };
    props.updateAppTitle('Reactor');
  }

  toggleInputField() {
    this.setState({
      showInputField: !this.state.showInputField,
      immediate: false,
    });
  }

  handleInputChange(val) {
    this.setState({
      inputValue: val,
    });
  }

  render() {
    const { listName, selectList, collections, pages, userCollectionIds, userPageIds, devMode } = this.props;
    const { showInputField, inputValue, immediate } = this.state;
    return (
      <Fragment >
        <Switch indicateIndex={listToIndex(listName)} className={styles.switch} >
          <SwitchItem onClick={() => selectList('collections')} >Collections</SwitchItem >
          <SwitchItem onClick={() => selectList('pages')} >Pages</SwitchItem >
        </Switch >
        {(collections.length === userCollectionIds.length && pages.length === userPageIds.length) && (
          <Fragment >
            <div
              className={cx(styles.listContainer, {
                [styles.focus]: listName === 'collections',
              })}
            >
              <Trail
                native
                initial={listName === 'collections' ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                items={collections}
                keys={item => item.name}
                from={listName === 'collections' ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
                to={listName === 'collections' ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
              >
                {item => (springs) => ( // eslint-disable-line
                  <animated.div key={item.id} className={styles.listItemWrap} style={{
                    opacity: springs.opacity,
                    transform: springs.x.interpolate(x => `translate3d(${x}%,0,0)`),
                  }} >
                    <Button
                      linkTo={`/cms/collection/${item.id}`}
                      type="white"
                      justifyContent="start"
                      disable={item.schema === undefined}
                    >
                      {item.name}
                    </Button >
                  </animated.div >
                )}
              </Trail >
            </div >
            <div className={cx(styles.listContainer, { [styles.focus]: listName === 'pages' })} >
              <Trail
                native
                initial={listName === 'pages' ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                items={pages}
                keys={item => item.name}
                from={listName === 'pages' ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
                to={listName === 'pages' ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
              >
                {item => springs => (
                  <animated.div key={item.id} className={styles.listItemWrap} style={{
                    opacity: springs.opacity,
                    transform: springs.x.interpolate(x => `translate3d(${x}%,0,0)`),
                  }} >
                    <Button
                      linkTo={`/cms/page/${item.id}/editor`}
                      type="white"
                      justifyContent="start"
                      disable={item.schema === undefined}
                    >
                      {item.name}
                    </Button >
                  </animated.div >
                )}
              </Trail >
            </div >
            <Spring
              from={{ transform: showInputField ? 'translateY(100%)' : 'translateY(0%)' }}
              to={{ transform: showInputField ? 'translateY(0%)' : 'translateY(100%)' }}
              immediate={immediate}
            >
              {springs => <div className={cx(styles.inputContainer)} style={springs} >
                <UserInput
                  placeholder="Type..."
                  onChange={this.handleInputChange}
                  value={inputValue}
                  // className={cx(styles.input, styles[`input-${deviceType}`])}
                  // onEnterKeyPress={this.logIn}
                />
              </div >}
            </Spring >
          </Fragment >
        )}
        {devMode && (
          <Spring
            from={{ transform: showInputField ? 'rotate(0deg)' : 'rotate(45deg)' }}
            to={{ transform: showInputField ? 'rotate(45deg)' : 'rotate(0deg)' }}
            immediate={immediate}
          >
            {springs => <Button
              type="circle"
              className={cx(styles.addBtn)}
              onClick={this.toggleInputField}
              style={springs}
            >
              <Add />
            </Button >}
          </Spring >
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
  devMode: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  listName: services.home.selectors.listName(state),
  prevPath: Routes.selectors.prevPath(state),
  userCollectionIds: Auth.selectors.userCollectionIds(state),
  userPageIds: Auth.selectors.userPageIds(state),
  collections: services.collections.selectors.list(state),
  pages: services.pages.selectors.list(state),
  devMode: services.app.selectors.devMode(state),
});

const mapDispatchToProps = dispatch => ({
  selectList: (...props) => dispatch(services.home.actions.selectList(...props)),
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle))
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
