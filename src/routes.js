import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';
import { App } from '/src/containers';

export default (
  <Route path="/" >
    <IndexRedirect to="cms/login" />
    <Route path="cms" component={App} >
      <IndexRedirect to="home" />
      <Route path="login" />
      <Route path="home" />
      <Route path="collection/:collectionId" />
      <Route path="collection/:collectionId/editor/:assetId" />
      <Route path="page/:pageId/editor" />
    </Route >
    <Redirect from="*" to="cms/home" />
  </Route >
);
