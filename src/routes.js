import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';
import { App, Login } from '/src/containers';

export default (
  <Route path="/" >
    <IndexRedirect to="login" />
    <Route path="cms" component={App} >
      <IndexRedirect to="home" />
      <Route path="home" />
      <Route path="collection/:collectionId" />
      <Route path="collection/:collectionId/schema" />
      <Route path="collection/:collectionId/editor/:assetId" />
      <Route path="page/:pageId/editor" />
    </Route >
    <Route path="login" component={Login}/>
    <Redirect from="*" to="cms/home" />
  </Route >
);
