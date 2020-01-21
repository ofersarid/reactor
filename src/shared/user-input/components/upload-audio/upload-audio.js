import React, { PureComponent, Fragment } from 'react';
import autoBind from 'auto-bind';
import Dropzone from 'react-dropzone';
import { Button } from '/src/shared';
import styles from './styles.scss';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import icon from './mp3-icon.svg';

class UploadAudio extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.ref = {
      canvas: React.createRef(),
      audio: React.createRef(),
    };
    this.state = {
      hover: false,
      file: props.value,
      isValid: !props.required,
      isPlaying: false,
    };
  }

  componentDidMount() {
    const { validateWith } = this.props;
    const { file } = this.state;
    this.setState({ isValid: validateWith(file) });
  }

  componentDidUpdate(prevProps, prevState) {
    const { value, validateWith } = this.props;
    const { file } = this.state;
    if (value !== prevProps.value) {
      this.setState({
        file: value,
        isValid: validateWith(value)
      });
      if (typeof value !== 'string') {
        this.blob = URL.createObjectURL(value);
      }
    }
    if (file && !prevState.file) {
      this.loadAudio();
    }
  }

  loadAudio() {
    const audioObj = this.ref.audio.current;
    audioObj.load();
  }

  onDrop(acceptedFiles) {
    const { onChange } = this.props;
    onChange(acceptedFiles[0]);
  }

  togglePlayState() {
    const { isPlaying } = this.state;
    if (isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  pause() {
    const audioObj = this.ref.audio.current;
    audioObj.pause();
    this.setState({ isPlaying: false });
  }

  play() {
    const audioObj = this.ref.audio.current;
    audioObj.play();
    this.setState({ isPlaying: true });
  }

  onDragEnter() {
    this.setState({ dragEnter: true });
  }

  onDragLeave() {
    this.setState({ dragEnter: false });
  }

  render() {
    const { file, isPlaying, dragEnter } = this.state;
    return (
      <Fragment >
        <Dropzone
          onDrop={this.onDrop}
          multiple={false}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
        >
          {({ getRootProps, getInputProps }) => (
            <section >
              <div {...getRootProps()} className={styles.dropSection} >
                <Fragment >
                  <img className={styles.icon} src={icon} />
                  <div >{dragEnter ? 'Drop File' : 'Click / Drag file'}</div >
                  <audio src={file ? (typeof file === 'string' ? file : this.blob) : undefined} ref={this.ref.audio} />
                </Fragment >
                <input {...getInputProps()} accept=".mp3" />
              </div >
            </section >
          )}
        </Dropzone >
        <Button onClick={this.togglePlayState} disable={!file} >
          {isPlaying ? 'Pause' : 'Play'}
        </Button >
      </Fragment >
    );
  }
}

UploadAudio.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  validateWith: PropTypes.func,
  required: PropTypes.bool,
};

UploadAudio.defaultProps = {
  onValidation: noop,
};

export default UploadAudio;
