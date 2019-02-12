import PropTypes from 'prop-types';

export const range = {
  min: PropTypes.number,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  })]).isRequired,
  onChange: PropTypes.func.isRequired,
};
