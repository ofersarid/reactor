import { ACTIONS } from './constants';

const updateAppTitle = newTitle => ({
  type: ACTIONS.HEADER_TITLE,
  newTitle,
});

export default {
  updateAppTitle,
};
