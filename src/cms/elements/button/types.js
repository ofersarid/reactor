import PropTypes from 'prop-types';
import { tipAnimations } from '../tooltip/types';

export const button = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClick: PropTypes.func,
  linkTo: PropTypes.string,
  color: PropTypes.string,
  textColor: PropTypes.string,
  disable: PropTypes.bool,
  stretch: PropTypes.bool,
  invert: PropTypes.bool,
  noAnimation: PropTypes.bool,
  tip: PropTypes.node,
  maxWidth: PropTypes.number,
  justIcon: PropTypes.bool,
  interactive: PropTypes.bool,
  tipAnimation: PropTypes.oneOf(tipAnimations),
  getRef: PropTypes.object,
};
