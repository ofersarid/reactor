import React, { PureComponent, Fragment } from 'react';
import cx from 'classnames';
import autoBind from 'auto-bind';
import ImageAsync from 'react-image-async';
import { imageFile } from '../../types';
import styles from './styles.scss';
import Button from '/src/cms/elements/button';
import { Image } from 'styled-icons/material/Image';
import { Rotate90DegreesCcw } from 'styled-icons/material/Rotate90DegreesCcw';
// import Toaster from '/src/cms/elements/toaster';
// import prettyBytes from 'pretty-bytes';
import Puff from '/src/cms/svg-loaders/puff.svg';
import noop from 'lodash/noop';
import { rotateImage90Deg } from '/src/cms/utils';
import ValidationIndicator from '../validation-indicator/validation-indicator';

class UploadImage extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.fileInput = React.createRef();
    this.state = {
      hover: false,
      preview: props.value,
      // fileToBig: false,
      // fileSize: null,
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
    this.file = file;
    const { onChange, transformer } = this.props;
    if (file) {
      // const fileToBig = file.size > 2000000;
      // if (fileToBig) {
      //   this.setState({ fileToBig: true, fileSize: prettyBytes(file.size) });
      //   return;
      // }
      if (transformer) {
        const transformedValue = transformer(file);
        if (transformedValue.then) {
          transformedValue.then(resp => onChange(resp));
        } else {
          onChange(transformedValue);
        }
      } else {
        onChange(file);
      }
      const preview = URL.createObjectURL(file);
      this.setState({ preview: preview });
    }
    this.showValidation();
  }

  handleClick(e) {
    e.stopPropagation();
    this.fileInput.current.click();
    this.clearError();
    this.showValidation();
  }

  clearError() {
    this.setState({ fileToBig: false, fileSize: null });
  }

  render() {
    const { preview, showValidation, validateWith } = this.state;
    const { onValidation, placeholder } = this.props;
    return (
      <div className={styles.imageUpload} >
        <div className={cx(styles.imagePreviewContainer, showValidation && styles.removeRightBorder)} >
          <ul className={styles.tools} >
            <li >
              <Button
                justIcon
                disable={!this.file}
                onClick={() => {
                  rotateImage90Deg(this.file)
                    .then(resp => this.handleChange(resp));
                }}
                tip="Rotate"
              >
                <Rotate90DegreesCcw />
              </Button >
            </li >
          </ul >
          <Button
            onClick={this.handleClick}
            className={styles.button}
          >
            {(preview.length && typeof preview === 'string') ? (
              <ImageAsync src={[preview]} >
                {({ loaded, error }) => (
                  <Fragment >
                    <div style={{ backgroundImage: `url(${loaded ? preview : Puff})` }} className={styles.image} />
                  </Fragment >
                )}
              </ImageAsync >
            ) : (
              <Fragment >
                <Image className={styles.imageIcon}/>
                <div >Select an image file from your computer</div >
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
              accept="image/*"
              className={styles.fileInput}
            />
            {/* <Toaster show={Boolean(fileToBig)} onClick={this.clearError} > */}
            {/* <span className={styles.spaceRight} >FIle is to big.</span > */}
            {/* <span className={styles.spaceRight} >must be smaller than <h3 >2Mb</h3 >.</span > */}
            {/* <span >(size is {fileSize})</span > */}
            {/* </Toaster > */}
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

UploadImage.propTypes = imageFile;

UploadImage.defaultProps = {
  onValidation: noop,
};

export default UploadImage;
