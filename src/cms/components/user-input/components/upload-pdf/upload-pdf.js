import React, { PureComponent, Fragment } from 'react';
import cx from 'classnames';
import autoBind from 'auto-bind';
import { pdfFile } from '../../types';
import styles from './styles.scss';
import { Button } from '/src/cms/components';
import { PictureAsPdf } from 'styled-icons/material/PictureAsPdf';
import noop from 'lodash/noop';
import ValidationIndicator from '../validation-indicator/validation-indicator';

class UploadPdf extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.fileInput = React.createRef();
    this.state = {
      hover: false,
      preview: props.value,
      showValidation: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (value !== prevProps.value && typeof value === 'string') {
      this.setState({ preview: value });
    }
  }

  componentWillUnmount() {
    this.willUnmount = true;
  }

  showValidation() {
    const { optional } = this.props;
    if (optional) return;
    this.setState({ showValidation: true });
  }

  handleChange(file) {
    const { onChange } = this.props;
    if (file) {
      onChange(file);
      // const fileProps = {
      //   name: file.name,
      //   lastModified: file.lastModified,
      //   size: file.size,
      // };
      const preview = URL.createObjectURL(file);
      this.setState({ preview: preview });
      // const reader = new window.FileReader();
      // reader.readAsDataURL(file);
      // if (reader.result) {
      //   this.setState({ preview: reader.result });
      // } else {
      //   reader.onloadend = () => {
      //     this.setState({ preview: reader.result });
      //   };
      // }
    }
    this.showValidation();
  }

  handleClick(e) {
    e.stopPropagation();
    this.fileInput.current.click();
    this.showValidation();
  }

  render() {
    const { preview, showValidation, validateWith } = this.state;
    const { onValidation, placeholder } = this.props;
    return (
      <div className={styles.imageUpload} >
        <div className={cx(styles.imagePreviewContainer, showValidation && styles.removeRightBorder)} >
          <Button
            onClick={this.handleClick}
            className={styles.button}
            noScale
          >
            {preview ? (
              <iframe src={preview} className={styles.pdfPreview} frameBorder="0" scrolling="no" />
            ) : (
              <Fragment >
                <PictureAsPdf className={styles.pfdIcon} />
                <div >Select a PDF file from your computer</div >
                <div className={styles.placeholder} >{placeholder}</div >
              </Fragment >
            )}
            <input
              ref={this.fileInput}
              type="file"
              onChange={e => {
                const firstFile = e.target.files[0];
                this.handleChange(firstFile);
              }}
              accept="application/pdf"
              className={styles.fileInput}
            />
          </Button >
        </div >
        <ValidationIndicator
          show={showValidation}
          min={1}
          onValidation={onValidation}
          value={preview}
          validateWith={validateWith}
        />
      </div >
    );
  }
}

UploadPdf.propTypes = pdfFile;

UploadPdf.defaultProps = {
  onValidation: noop,
};

export default UploadPdf;
