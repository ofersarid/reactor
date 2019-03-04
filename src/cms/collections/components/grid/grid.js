import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Device from '/src/cms/device/index';
import Button from '/src/cms/elements/button/index';
import { Check } from 'styled-icons/fa-solid/Check';
import { Cancel } from 'styled-icons/material/Cancel';
import { ActivityToaster } from '/src/cms/activity';
import Toaster from '/src/cms/elements/toaster/index';
import StackGrid from 'react-stack-grid';
import { TrashAlt } from 'styled-icons/boxicons-solid/TrashAlt';
import App from '/src/cms/app/index';
import { firestoreConnect } from 'react-redux-firebase';
import Routes from '/src/routes';
import Toolbar from '../toolbar/toolbar';
import CMSEntityItem from './item';
import styles from './styles.scss';
import { grid } from '../../types';
import * as selectors from '../../selectors';
import * as actions from '../../actions';

const calcColumnWidth = (isMobile, sideNavOpen) => {
  if (isMobile) {
    return `${Math.round(100 / ((window.innerWidth - App.consts.SIDE_NAV_COLLAPSE_WIDTH) / 250))}%`;
  } else if (sideNavOpen) {
    return `${Math.round(100 / ((window.innerWidth - App.consts.SIDE_NAV_WIDTH) / 350))}%`;
  }
  return `${Math.round(100 / ((window.innerWidth - App.consts.SIDE_NAV_COLLAPSE_WIDTH) / 350))}%`;
};

class Grid extends PureComponent {
  render() {
    const {
      isMobile, list, markedForDelete,
      deleteEntities, children, collection, toggleDeleteMode, collectionId,
    } = this.props;
    return collection ? (
      <Fragment >
        <Toolbar />
        <div className={styles.gridWrapper} >
          {list && (
            <StackGrid
              columnWidth={calcColumnWidth(isMobile)}
            >
              {list.map(item => (
                <div key={item.id} >
                  {collection.entity && <CMSEntityItem
                    item={item}
                    icon={collection.icon}
                    entity={collection.entity}
                  />}
                </div >
              ))}
            </StackGrid >
          )}
        </div >
        <Toaster show={markedForDelete.size > 0} >
          <TrashAlt className={styles.trash} />
          <div className={styles.disclaimer} >You Are About to Delete {markedForDelete.size} Items</div >
          <Button
            onClick={() => {
              deleteEntities(collectionId, markedForDelete.toJS()).then(toggleDeleteMode);
            }}
          >
            <Check />
            <div >Confirm</div >
          </Button >
          <Button onClick={toggleDeleteMode} >
            <Cancel />
            <div >Cancel</div >
          </Button >
        </Toaster >
        <ActivityToaster />
        {children}
      </Fragment >
    ) : null;
  }
}

Grid.propTypes = grid;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  list: selectors.filteredOrderedList(state),
  markedForDelete: App.selectors.markedForDelete(state),
  deleteMode: App.selectors.deleteMode(state),
  sideNavOpen: App.selectors.sideNavOpen(state),
  collectionId: Routes.selectors.collectionId(state),
  collection: selectors.collection(state),
});

const mapDispatchToProps = (dispatch) => ({
  toggleDeleteMode: () => dispatch(App.actions.toggleDeleteMode()),
  deleteEntities: (...props) => dispatch(actions.deleteEntities(...props)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    return [{
      collection: 'collections',
      doc: props.collectionId,
      subcollections: [{
        collection: 'data',
        // where: [['active', '==', true]],
        orderBy: ['name', 'desc'],
      }],
    }];
  }),
)(Grid);
