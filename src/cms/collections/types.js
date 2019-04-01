import PropTypes from 'prop-types';
import { deviceTypes } from '/src/device/types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { inputTypes } from '/src/elements/user-input/types';

export const field = PropTypes.shape({
  disabled: PropTypes.bool.isRequired,
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  maxChars: PropTypes.number,
  minChars: PropTypes.number,
  required: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(inputTypes).isRequired,
});

export const uiKeyMap = PropTypes.shape({
  title: PropTypes.string.isRequired,
});

export const collection = PropTypes.shape({
  fields: PropTypes.arrayOf(field),
  name: PropTypes.string,
  icon: PropTypes.string,
  owner: PropTypes.string,
  public: PropTypes.bool,
  data: PropTypes.any,
});

export const grid = {
  isMobile: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object),
  markedForDelete: ImmutablePropTypes.listOf(PropTypes.object).isRequired,
  deleteMode: PropTypes.bool.isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
  collection: collection,
  collectionId: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export const entityItem = {
  ...deviceTypes,
  item: PropTypes.object.isRequired,
  fields: PropTypes.arrayOf(field).isRequired,
  deleteMode: PropTypes.bool.isRequired,
  markedForDelete: ImmutablePropTypes.listOf(PropTypes.object).isRequired,
  markForDelete: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  orderBy: PropTypes.string,
};

export const editor = {
  entity: PropTypes.object,
  isAdd: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  collection: collection,
  collectionId: PropTypes.string.isRequired,
  entityId: PropTypes.string,
  update: PropTypes.func.isRequired,
};

export const generalAssets = {
  ...deviceTypes,
  update: PropTypes.func.isRequired,
};
