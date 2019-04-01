import { deviceTypes } from '/src/device/types';
import PropTypes from 'prop-types';
import { field } from '/src/cms/collections/types';

export const toolbar = {
  ...deviceTypes,
  // onClickDelete: PropTypes.func,
  // filters: PropTypes.arrayOf(PropTypes.string),
  // sortOptions: PropTypes.arrayOf(PropTypes.string),
  // collection: PropTypes.string.isRequired,
  // fields: PropTypes.arrayOf(field).isRequired,
};

export const addButton = {
  isMobile: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
};

export const deleteButton = {
  toggleDeleteMode: PropTypes.func.isRequired,
  deleteMode: PropTypes.bool.isRequired,
};

export const downloadCsv = {
  collection: PropTypes.shape({
    entity: PropTypes.shape({
      fields: PropTypes.arrayOf(field).isRequired,
    }),
  }).isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
};
