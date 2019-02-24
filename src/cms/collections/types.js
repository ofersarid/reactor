import PropTypes from 'prop-types';
import { deviceTypes } from '/src/cms/device/types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { inputTypes } from '/src/cms/elements/user-input/types';

export const field = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(inputTypes).isRequired,
  required: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  minChars: PropTypes.number,
  maxChars: PropTypes.number,
  initialValue: PropTypes.any,
});

export const collectionEditor = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.any,
  filters: PropTypes.arrayOf(PropTypes.string),
  sortOptions: PropTypes.arrayOf(PropTypes.string),
  fields: PropTypes.arrayOf(field).isRequired,
};

export const collectionContainer = {
  collectionId: PropTypes.string.isRequired,
  collection: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    public: PropTypes.bool.isRequired,
    schema: PropTypes.arrayOf(field).isRequired,
    filters: PropTypes.arrayOf(PropTypes.string),
    sortOptions: PropTypes.arrayOf(PropTypes.string),
  }),
  children: PropTypes.any,
};

export const cmsEntityGrid = {
  ...deviceTypes,
  route: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  entities: PropTypes.arrayOf(PropTypes.object),
  deleteMode: PropTypes.bool.isRequired,
  markedForDelete: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  children: PropTypes.any,
  toggleDeleteMode: PropTypes.func.isRequired,
  icon: PropTypes.node,
  permissions: PropTypes.arrayOf(PropTypes.string),
  filters: PropTypes.arrayOf(PropTypes.string),
  sortOptions: PropTypes.arrayOf(PropTypes.string),
  list: PropTypes.arrayOf(PropTypes.object),
  schema: PropTypes.arrayOf(field).isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
  downloadCsv: PropTypes.func,
};

export const entityItem = {
  ...deviceTypes,
  entity: PropTypes.object,
  deleteMode: PropTypes.bool.isRequired,
  markedForDelete: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  markForDelete: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
  icon: PropTypes.node,
  linkIcon: PropTypes.node,
  orderBy: PropTypes.string,
  fields: PropTypes.arrayOf(field).isRequired,
};

export const entityEditor = {
  ...deviceTypes,
  entity: PropTypes.object,
  updateEntity: PropTypes.func.isRequired,
  isAdd: PropTypes.bool.isRequired,
  route: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  editorFields: PropTypes.arrayOf(field).isRequired,
  pathname: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.object),
};

export const generalAssets = {
  ...deviceTypes,
  update: PropTypes.func.isRequired,
};
