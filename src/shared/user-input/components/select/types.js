import PropTypes from 'prop-types';

export const select = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired),
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  allowMissMatch: PropTypes.bool, /* if true -will leave the value
  as it is if there is no match to an options */
  isSearchable: PropTypes.bool,
  isClearable: PropTypes.bool,
};
