import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import { AddCircle } from 'styled-icons/material/AddCircle';
import Button from '/src/cms/elements/button';
import Routes from '/src/routes';
import { addButton } from '../../types';

const AddButton = props => (
  <Button
    linkTo={`${props.pathname}/add`}
    noAnimation
    tip="New Entity"
    justIcon={props.isMobile}
  >
    <AddCircle />
    {!props.isMobile && <div >Add</div >}
  </Button >
);

AddButton.propTypes = addButton;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  pathname: Routes.selectors.pathname(state),
});

export default connect(mapStateToProps, {})(AddButton);
