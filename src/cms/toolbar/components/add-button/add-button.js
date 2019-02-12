import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import { AddCircle } from 'styled-icons/material/AddCircle';
import Button from '/src/cms/elements/button';
import { addButton } from '../../types';

const AddButton = props => (
  <Button
    linkTo={props.addRoute}
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
});

export default connect(mapStateToProps, {})(AddButton);
