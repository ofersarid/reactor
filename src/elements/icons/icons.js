import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/device/index';
import { Collection } from 'styled-icons/boxicons-solid/Collection';
import { Contacts } from 'styled-icons/material/Contacts';
import { CartAlt } from 'styled-icons/boxicons-solid/CartAlt';
import { icons } from './types';

const Icons = props => {
  switch (props.name) {
    case 'Contacts':
      return <Contacts />;
    case 'Cart':
      return <CartAlt />;
    default:
      return <Collection />;
  }
};

Icons.propTypes = icons;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(Icons);
