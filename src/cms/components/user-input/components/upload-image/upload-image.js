import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import autoBind from 'auto-bind';
import ImageAsync from 'react-image-async';
// import Resizer from 'react-image-file-resizer';
// import { imageFile } from '../../types';
import styles from './styles.scss';
import { Button } from '/src/cms/components';
// import { Image as ImageIcon } from 'styled-icons/material/Image';
// import { Rotate90DegreesCcw } from 'styled-icons/material/Rotate90DegreesCcw';
import Puff from '/src/svg-loaders/puff.svg';
import noop from 'lodash/noop';

const MAX_DIMENSION = 1200;

class UploadImage extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.fileInput = React.createRef();
    this.state = {
      hover: false,
      preview: props.value,
      isValid: false,
    };
  }

  componentDidMount() {
    const { value, validateWith } = this.props;
    this.setState({ isValid: validateWith(value) });
  }

  componentDidUpdate(prevProps) {
    const { value, validateWith } = this.props;
    if (value !== prevProps.value && typeof value === 'string') {
      this.setState({ preview: value });
    }
    this.setState({ isValid: validateWith(value) });
  }

  componentWillUnmount() {
    this.willUnmount = true; // todo - check if redundant
  }

  dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = parts[1];

      return new Blob([raw], { type: contentType });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  imageOptimizer() {
    return new Promise(resolve => {
      // Load the image
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = (imageEvent) => {
          // Resize the image
          const canvas = document.createElement('canvas');
          const maxSize = MAX_DIMENSION;
          let width = image.width;
          let height = image.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL(this.file.type);
          const resizedImage = this.dataURLToBlob(dataUrl);
          resolve(new File([resizedImage], this.file.name, {
            type: this.file.type,
          }));
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(this.file);
    });
  };

  onRotateClick() {
    this.rotateImage90Deg().then(resp => this.handleChange(resp));
  }

  rotateImage90Deg() {
    return new Promise(resolve => {
      // Load the image
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.height;
          canvas.height = image.width;
          const ctx = canvas.getContext('2d');
          ctx.save();
          const angle = 90 * Math.PI / 180;
          ctx.translate(Math.abs(image.width / 2 * Math.cos(angle) + image.height / 2 * Math.sin(angle)), Math.abs(image.height / 2 * Math.cos(angle) + image.width / 2 * Math.sin(angle)));
          ctx.rotate(angle);
          ctx.translate(-image.width / 2, -image.height / 2);
          ctx.drawImage(image, 0, 0);
          ctx.restore();
          const dataUrl = canvas.toDataURL(this.file.type);
          resolve(new File([this.dataURLToBlob(dataUrl)], this.file.name, {
            type: this.file.type,
          }));
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(this.file);
    });
  };

  handleChange(file) {
    this.file = file;
    const { onChange, validateWith } = this.props;
    let preview;
    if (file) {
      this.imageOptimizer().then(resp => onChange(resp));
      preview = URL.createObjectURL(file);
    }
    this.setState({ preview: preview });
    this.setState({ isValid: validateWith(preview) });
  }

  handleClick(e) {
    e.stopPropagation();
    this.fileInput.current.click();
  }

  render() {
    const { preview, isValid } = this.state;
    const hasImage = preview.length && typeof preview === 'string';
    return (
      <div className={styles.imageUpload} >

        {hasImage ? (
          <div className={cx(styles.imagePreviewContainer)} >
            <ImageAsync src={[preview]} >
              {({ loaded, error }) => (
                <Fragment >
                  <img src={loaded ? preview : Puff} className={styles.image} />
                </Fragment >
              )}
            </ImageAsync >
          </div >
        ) : null}
        {hasImage ? (
          <Button
            className={styles.button}
            onClick={this.onRotateClick}
            tip="Rotate"
            type="white"
          >
            Rotate
          </Button >
        ) : null}
        <Button
          onClick={this.handleClick}
          className={styles.button}
          type={isValid ? 'white' : 'red'}
        >
          {hasImage ? 'Replace' : 'Upload'}
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
        </Button >
      </div >
    );
  }
}

UploadImage.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  validateWith: PropTypes.func,
};

UploadImage.defaultProps = {
  onValidation: noop,
};

export default UploadImage;
