import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import styles from './styles.scss';
import { Button } from '/src/shared';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import pdfIcon from './pdf-icon.svg';

class UploadPdf extends PureComponent {
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

  handleChange(file) {
    const { onChange, validateWith } = this.props;
    let preview;
    if (file) {
      onChange(file);
      // const fileProps = {
      //   name: file.name,
      //   lastModified: file.lastModified,
      //   size: file.size,
      // };
      preview = URL.createObjectURL(file);
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
    this.setState({ preview: preview });
    this.setState({ isValid: validateWith(preview) });
  }

  handleClick(e) {
    e.stopPropagation();
    this.fileInput.current.click();
  }

  render() {
    const { preview, isValid } = this.state;
    const hasPDF = preview.length && typeof preview === 'string';
    return (
      <div className={styles.pdfUpload} >
        {preview ? (
          <Button tag="a" type="icon" className={styles.icon} domProps={{
            rel: 'noreferrer noopener',
            target: '_blank',
            href: preview,
          }} >
            <img src={pdfIcon} />
          </Button >
        ) : null}
        <Button
          onClick={this.handleClick}
          className={styles.button}
          type={isValid ? 'white' : 'red'}
        >
          {hasPDF ? 'Replace' : 'Upload'}
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
    );
  }
}

UploadPdf.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  validateWith: PropTypes.func,
};

UploadPdf.defaultProps = {
  onValidation: noop,
};

export default UploadPdf;
