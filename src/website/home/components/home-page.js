import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Device from '/src/cms/device/index';
import { filteredOrderedList } from '/src/cms/collections/selectors';
import { Button } from '/src/cms/elements';
import types from '../types';
// import { firestoreConnect } from 'react-redux-firebase';

const HomePage = props => {
  return (
    <Fragment >
      <h1 >Home Page</h1 >
      <Button
        linkTo="website/create-account"
        color="green"
      >
        <div >Create Account</div >
      </Button >
      {/* <h2>My Events:</h2> */}
      {/* {props.events.map(event => <div key={event.id}>{event.title}</div>)} */}
    </Fragment >
  );
};

HomePage.propTypes = types;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
  events: filteredOrderedList(state, 'events'),
});

export default compose(
  connect(mapStateToProps, {}),
  // firestoreConnect(() => ([{
  //   collection: 'events',
  //   orderBy: ['dateTime', 'desc'],
  //   where: [['active', '==', true]],
  // }])),
)(HomePage);
