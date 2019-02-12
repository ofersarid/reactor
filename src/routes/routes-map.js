import React from 'react';
import { Route, Redirect, IndexRedirect } from 'react-router';
import { MainContainer } from '/src/cms/app';
import LoginPage from '/src/cms/auth/components/login-page/login-page';
import ReduxRoutes from '/src/routes/components/redux-routes/redux-routes';
import CollectionContainer from '/src/cms/collections/components/collection-container/collection-container';
// import WebsiteRoutes from '/src/website/routes';
// import { WebsiteMainContainer } from '../website/ws-main-container';
// import About from '../website/about';
import { WebsiteMainContainer } from '/src/website/ws-main-container';
import { GeneralAssets } from '/src/cms/collections';
import { Home } from '/src/website/home';
import About from '/src/website/about';
import { COLLECTIONS, GENERAL_ASSETS } from '/collections.config';
import { ContactUs } from '/src/website/contact-us';
import { CreateAccountDialog } from '/src/website/create-account';

export default (
  <Route path="/" component={ReduxRoutes} >
    <IndexRedirect to="website/home" />
    <Route path="cms" component={MainContainer} >
      {COLLECTIONS.map(col => (
        <Route
          path={col.id}
          component={() => <CollectionContainer {...col} />}
          key={col.id}
        >
          <Route path="edit/:id" />
          <Route path="add" />
        </Route >
      ))}
      {GENERAL_ASSETS.length && <Route path="general-assets" component={GeneralAssets} />}
    </Route >
    <Route path="login" component={LoginPage} />
    <Route path="website" component={WebsiteMainContainer} >
      <IndexRedirect to="home" />
      <Route path="home" component={Home} />
      <Route path="create-account" component={CreateAccountDialog} />
      <Route path="about" component={About} />
      <Route path="contact" component={ContactUs} />
    </Route >
    <Redirect from="*" to="/website/home" />
  </Route >
);
