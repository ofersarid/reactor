import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';
import { App } from '/src/containers';

export default (
  <Route path="/" component={App} >
    <IndexRedirect to="login" />
    <Route path="cms" >
      <IndexRedirect to="home" />
      <Route path="home(/:state)" />
      <Route path="collection/:collectionId" />
      <Route path="collection/:collectionId/schema" />
      <Route path="collection/:collectionId/schema(/:fieldIndex)/editor" />
      <Route path="collection/:collectionId/settings" />
      <Route path="collection/:collectionId/editor(/:assetId)" />
      <Route path="page/:pageId/editor" />
      <Route path="page/:pageId/schema" />
      <Route path="page/:pageId/schema(/:fieldIndex)/editor" />
      <Route path="page/:pageId/settings" />
    </Route >
    <Route path="login" />
    <Redirect from="*" to="cms/home" />
  </Route >
);
