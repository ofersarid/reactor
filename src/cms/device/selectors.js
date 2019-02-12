import { createSelector } from 'reselect';

export const deviceType = state => state.getIn(['device', 'type']);
export const isMobile = createSelector(deviceType, type => type === 'mobile');
export const deviceOrientation = state => state.getIn(['device', 'orientation']);
