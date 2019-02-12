import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CloudUploadAlt } from 'styled-icons/fa-solid/CloudUploadAlt';
import { activityToaster } from '../types';
import Toaster from '/src/cms/elements/toaster';
import { uploadingFiles, uploadStatus } from '../selectors';
import styles from './styles.scss';

class ActivityToaster extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  componentDidUpdate(prevProps) {
    const { uploadStatus } = this.props;
    const { value } = this.state;
    if (uploadStatus > value && uploadStatus !== Infinity) {
      this.setState({ value: uploadStatus });
    }
  }

  render() {
    const { uploadingFiles } = this.props;
    const { value } = this.state;
    return (
      <Toaster type="success" show={uploadingFiles} >
        <div
          className={styles.status}
          style={{ transform: `scaleX(${value / 100})` }}
        />
        <CloudUploadAlt className={styles.icon} />
        <div className={styles.toFront}>Uploading Files...</div>
      </Toaster>
    );
  }
}

ActivityToaster.propTypes = activityToaster;

const mapStateToProps = state => ({
  uploadingFiles: uploadingFiles(state),
  uploadStatus: uploadStatus(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(ActivityToaster);
