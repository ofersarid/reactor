const services = {
  blackList: require('./blacklist').default,
  home: require('./home').default,
  collections: require('./collections').default,
  pages: require('./pages').default,
  asset: require('./asset').default,
};

window.services = services;

export default services;
