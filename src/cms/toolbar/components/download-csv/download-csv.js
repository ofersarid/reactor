import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import Button from '/src/cms/elements/button';
import { downloadCsv } from '../../types';
import { Download2 } from 'styled-icons/icomoon/Download2';

const DeleteButton = props => (
  <Button
    noAnimation
    onClick={props.onClickDownload}
    tip="Download as CSV"
    justIcon={props.isMobile}
  >
    <Download2 />
    {!props.isMobile && <div >Download</div >}
  </Button >
);

DeleteButton.propTypes = downloadCsv;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(DeleteButton);
