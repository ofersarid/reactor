import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';
import { App } from '/src/cms/components';
// import { LoginPage, Home, Page } from '/src/cms/pages';
import ReduxRoutes from '/src/routes/components/redux-routes/redux-routes';
// import { Grid, Editor, AddCollectionDialog, AddDocumentDialog } from '/src/cms/collections';
// import { WebsiteMainContainer } from '/src/website/ws-main-container';
// import { Home } from '/src/website/home';
// import About from '/src/website/about';
// import { ContactUs } from '/src/website/contact-us';
// import { UnderConstruction } from '/src/elements';
// import { CreateAccountDialog } from '/src/website/create-account';

export default (
  <Route path="/" component={ReduxRoutes} >
    <IndexRedirect to="cms/login" />
    <Route path="cms" component={App} >
      <IndexRedirect to="home" />
      {/* <Route path="collection/:collectionId" component={Grid} > */}
      {/*   <Route path="add" component={Editor} /> */}
      {/*   <Route path="edit/:entityId" component={Editor} /> */}
      {/* </Route > */}
      <Route path="home" />
      <Route path="editor/:id" />
      <Route path="login" />
      {/* <Route path="settings" component={UnderConstruction} /> */}
      {/* <Route path="add-collection" component={AddCollectionDialog} /> */}
      {/* <Route path="add-document" component={AddDocumentDialog} /> */}
    </Route >
    {/* <Route path="website" component={WebsiteMainContainer} > */}
    {/*  <IndexRedirect to="home" /> */}
    {/*  <Route path="home" component={Home} /> */}
    {/*  <Route path="create-account" component={CreateAccountDialog} /> */}
    {/*  <Route path="about" component={About} /> */}
    {/*  <Route path="contact" component={ContactUs} /> */}
    {/* </Route > */}
    <Redirect from="*" to="cms/login" />
  </Route >
);
