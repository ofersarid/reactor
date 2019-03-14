import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CloudUploadAlt } from 'styled-icons/fa-solid/CloudUploadAlt';
import { activity } from '../types';
import Toaster from '/src/cms/elements/toaster';
import { uploadStatus, uploadingFiles } from '../selectors';
import styles from './styles.scss';

class ActivityToaster extends PureComponent {
  render() {
    const { uploadStatus, uploadingFiles } = this.props;
    return (
      <Toaster type="success" show={uploadingFiles} >
        <div
          className={styles.status}
          style={{ transform: `scaleX(${uploadStatus / 100})` }}
        />
        <CloudUploadAlt className={styles.icon} />
        <div className={styles.toFront}>Uploading Files...</div>
      </Toaster>
    );
  }
}

ActivityToaster.propTypes = activity;

const mapStateToProps = state => ({
  uploadStatus: uploadStatus(state),
  uploadingFiles: uploadingFiles(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(ActivityToaster);
