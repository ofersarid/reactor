import blackList from './blacklist';
import home from './home';
import collections from './collections';
import pages from './pages';
import asset from './asset';
import app from './app';
import device from './device';
import router from './redux-router';
import auth from './auth';

const services = {
  blackList,
  home,
  collections,
  pages,
  asset,
  app,
  device,
  router,
  auth
};

window.services = services;

export default services;
