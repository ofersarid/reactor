import { deviceTypes } from '/src/cms/device/types';
import PropTypes from 'prop-types';
import { field } from '/src/cms/collections/types';

export const toolbar = {
  ...deviceTypes,
  addRoute: PropTypes.string,
  onClickDelete: PropTypes.func,
  filters: PropTypes.arrayOf(PropTypes.string),
};

export const addButton = {
  addRoute: PropTypes.string.isRequired,
};

export const deleteButton = {
  onClickDelete: PropTypes.func.isRequired,
  deleteMode: PropTypes.bool.isRequired,
};

export const filters = {
  ...deviceTypes,
  filters: PropTypes.arrayOf(PropTypes.string),
  updateQuery: PropTypes.func.isRequired,
  updateOrder: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  sortOptions: PropTypes.arrayOf(PropTypes.string),
  sortBy: PropTypes.string,
  collection: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(field).isRequired,
};
