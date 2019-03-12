import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CloudUploadAlt } from 'styled-icons/fa-solid/CloudUploadAlt';
import { activityToaster } from '../types';
import Toaster from '/src/cms/elements/toaster';
import { uploadStatus } from '../selectors';
import styles from './styles.scss';

class ActivityToaster extends PureComponent {
  render() {
    const { uploadStatus } = this.props;
    return (
      <Toaster type="success" show={uploadStatus > 0 && uploadStatus < 100 && uploadStatus !== Infinity} >
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

ActivityToaster.propTypes = activityToaster;

const mapStateToProps = state => ({
  uploadStatus: uploadStatus(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(ActivityToaster);
