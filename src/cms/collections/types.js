import PropTypes from 'prop-types';
import { deviceTypes } from '/src/cms/device/types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { inputTypes } from '/src/cms/elements/user-input/types';

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
  entity: PropTypes.shape({
    fields: PropTypes.arrayOf(field).isRequired,
    uiKeyMap: uiKeyMap.isRequired,
  }),
  name: PropTypes.string,
  icon: PropTypes.string,
  owner: PropTypes.string,
  public: PropTypes.bool,
  data: PropTypes.any,
});

export const grid = {
  isMobile: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object),
  markedForDelete: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  deleteMode: PropTypes.bool.isRequired,
  sideNavOpen: PropTypes.bool.isRequired,
  collection: collection,
  collectionId: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export const entityItem = {
  ...deviceTypes,
  item: PropTypes.object.isRequired,
  entity: PropTypes.shape({
    fields: PropTypes.arrayOf(field).isRequired,
    uiKeyMap: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  deleteMode: PropTypes.bool.isRequired,
  markedForDelete: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  markForDelete: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  icon: PropTypes.node,
  linkIcon: PropTypes.node,
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
