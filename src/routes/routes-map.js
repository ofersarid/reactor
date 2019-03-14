import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';
import { MainContainer } from '/src/cms/app';
import LoginPage from '/src/cms/auth/components/login-page/login-page';
import ReduxRoutes from '/src/routes/components/redux-routes/redux-routes';
import { Grid, Editor } from '/src/cms/collections';
// import WebsiteRoutes from '/src/website/routes';
// import { WebsiteMainContainer } from '../website/ws-main-container';
// import About from '../website/about';
// import { WebsiteMainContainer } from '/src/website/ws-main-container';
// import { GeneralAssets } from '/src/cms/collections';
// import { Home } from '/src/website/home';
// import About from '/src/website/about';
// import { COLLECTIONS, GENERAL_ASSETS } from '/collections.config';
// import { ContactUs } from '/src/website/contact-us';
// import { CreateAccountDialog } from '/src/website/create-account';

// const DummyComponent = () => (<div >Dummy</div >);

export default (
  <Route path="/" component={ReduxRoutes} >
    <IndexRedirect to="cms/collection/id?" />
    <Route path="cms" component={MainContainer} >
      <IndexRedirect to="collection/id?" />
      <Route path="collection/:collectionId" component={Grid} >
        <Route path="add" component={Editor} />
        <Route path="edit/:entityId" component={Editor} />
      </Route >
      <Route path="login" component={LoginPage} />
    </Route >
    {/* <Route path="website" component={WebsiteMainContainer} > */}
    {/* <IndexRedirect to="home" /> */}
    {/* <Route path="home" component={Home} /> */}
    {/* <Route path="create-account" component={CreateAccountDialog} /> */}
    {/* <Route path="about" component={About} /> */}
    {/* <Route path="contact" component={ContactUs} /> */}
    {/* </Route > */}
    <Redirect from="*" to="cms/collection/id?" />
  </Route >
);
