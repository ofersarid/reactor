import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Device from '/src/cms/device/index';
// import { filteredOrderedList } from '/src/cms/collections/selectors';
import { Button } from '/src/cms/elements';
import types from '../types';
import { firestoreConnect } from 'react-redux-firebase';
import Collections from '/src/cms/collections';

const HomePage = props => {
  console.log(props.contacts);
  return (
    <Fragment >
      <h1 >Home Page</h1 >
      <Button
        linkTo="website/create-account"
        color="green"
      >
        <div >Create Account</div >
      </Button >
      <Button
        linkTo="cms/login"
        color="green"
      >
        <div >Log In</div >
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
  contacts: Collections.selectors.collection(state, '8gFxx830klmI0HDeOIEU'),
});

export default compose(
  connect(mapStateToProps, {}),
  firestoreConnect(() => ([{
    collection: 'collections',
    doc: '8gFxx830klmI0HDeOIEU',
    subcollections: [{
      collection: 'data',
      // where: [['active', '==', true]],
      orderBy: ['name', 'desc'],
    }],
  }])),
)(HomePage);
