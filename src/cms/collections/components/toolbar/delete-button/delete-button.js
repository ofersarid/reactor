import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/device/index';
import { Button } from '/src/cms/shared';
import { deleteButton } from '../types';
import App from '/src/cms/shared/app/index';
import { TrashAlt } from 'styled-icons/boxicons-solid/TrashAlt';

const DeleteButton = props => (
  <Button
    justIcon
    onClick={props.toggleDeleteMode}
    textColor={props.deleteMode ? 'red' : null}
    tip="Toggle Delete Mode"
  >
    <TrashAlt />
  </Button >
);

DeleteButton.propTypes = deleteButton;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  deleteMode: App.selectors.deleteMode(state),
});

const mapDispatchToProps = dispatch => ({
  toggleDeleteMode: () => dispatch(App.actions.toggleDeleteMode()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteButton);
