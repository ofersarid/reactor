import { ACTIONS } from './constants';

const showSplash = () => {
  return {
    type: ACTIONS.SHOW_SPLASH,
  };
};

const hideSplash = () => {
  return {
    type: ACTIONS.HIDE_SPLASH,
  };
};

export default {
  showSplash,
  hideSplash,
};
