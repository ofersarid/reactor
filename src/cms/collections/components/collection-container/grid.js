import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Device from '/src/cms/device/index';
import Button from '/src/cms/elements/button/index';
import { Check } from 'styled-icons/fa-solid/Check';
import { Cancel } from 'styled-icons/material/Cancel';
import Auth from '/src/cms/auth/index';
import { Toolbar } from '/src/cms/toolbar/index';
import { firestoreConnect } from 'react-redux-firebase';
import { ActivityToaster } from '/src/cms/activity';
import Toaster from '/src/cms/elements/toaster/index';
import StackGrid from 'react-stack-grid';
import { TrashAlt } from 'styled-icons/boxicons-solid/TrashAlt';
import App from '/src/cms/app/index';
import CMSEntityItem from './item';
import styles from './styles.scss';
import { cmsEntityGrid } from '../../types';
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
      route, toggleDeleteMode, filters, sortOptions, isMobile, list, icon,
      schema, markedForDelete, deleteEntities, children, collection, downloadCsv,
    } = this.props;
    return (
      <Fragment >
        <Toolbar
          addRoute={`${route}/add`}
          onClickDelete={toggleDeleteMode}
          onClickDownload={() => downloadCsv(list)}
          filters={filters}
          sortOptions={sortOptions}
          collection={collection}
          fields={schema}
        />
        <div className={styles.gridWrapper} >
          <StackGrid
            columnWidth={calcColumnWidth(isMobile)}
          >
            {list.map(item => (
              <div key={item.id} >
                <CMSEntityItem
                  entity={item}
                  route={route}
                  icon={icon}
                  fields={schema}
                />
              </div >
            ))}
          </StackGrid >
        </div >
        <Toaster show={markedForDelete.size > 0} >
          <TrashAlt className={styles.trash} />
          <div className={styles.disclaimer} >You Are About to Delete {markedForDelete.size} Items</div >
          <Button
            onClick={() => {
              deleteEntities().then(toggleDeleteMode);
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
    );
  }
}

Grid.propTypes = cmsEntityGrid;

const mapStateToProps = (state, ownProps) => ({
  isMobile: Device.selectors.isMobile(state),
  list: selectors.filteredOrderedList(state, ownProps.collection),
  markedForDelete: App.selectors.markedForDelete(state),
  deleteMode: App.selectors.deleteMode(state),
  permissions: Auth.selectors.permissions(state),
  sideNavOpen: App.selectors.sideNavOpen(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleDeleteMode: () => dispatch(App.actions.toggleDeleteMode()),
  deleteEntities: () => dispatch(actions.deleteEntities(ownProps.collection)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => ([{
    collection: props.collection,
  }])),
)(Grid);
