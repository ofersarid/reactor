import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';
import { App } from '/src/containers';

export default (
  <Route path="/" component={App} >
    <IndexRedirect to="login" />
    <Route path="cms" >
      <IndexRedirect to="home" />
      <Route path="home" />
      <Route path="collection/:collectionId" />
      <Route path="collection/:collectionId/schema" />
      <Route path="collection/:collectionId/editor/:assetId" />
      <Route path="page/:pageId/editor" />
      <Route path="page/:pageId/schema" />
      <Route path="page/:pageId/schema/editor" />
    </Route >
    <Route path="login" />
    <Redirect from="*" to="cms/home" />
  </Route >
);
