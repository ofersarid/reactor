import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/device/index';
import { AddCircle } from 'styled-icons/material/AddCircle';
import { Button } from '/src/cms/components';
import Routes from '/src/routes/index';
import { addButton } from '../types';

const AddButton = props => (
  <Button
    linkTo={`${props.pathname}/add`}
    tip="New Entity"
    justIcon
  >
    <AddCircle />
  </Button >
);

AddButton.propTypes = addButton;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  pathname: Routes.selectors.pathname(state),
});

export default connect(mapStateToProps, {})(AddButton);
