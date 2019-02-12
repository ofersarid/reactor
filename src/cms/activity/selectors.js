import throttle from 'lodash/throttle';

export const uploadingFiles = state => state.getIn(['activity', 'uploadingFiles']);

export const uploadStatus = throttle(
  state => Math.min(...state.getIn(['activity', 'uploadStatus']).toIndexedSeq().toArray()),
  1000,
);
