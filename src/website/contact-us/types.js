import PropTypes from 'prop-types';
import { deviceTypes } from '/src/cms/device/types';

export const contactForm = {
  onSend: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export const contactUs = {
  ...deviceTypes,
};
