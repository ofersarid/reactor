import PropTypes from 'prop-types';

export const select = {
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  allowMissMatch: PropTypes.bool, /* if true -will leave the value
  as it is if there is no match to an options */
  isSearchable: PropTypes.bool,
  isClearable: PropTypes.bool,
  value: PropTypes.any,
};
