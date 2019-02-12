import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import styles from './styles.scss';
import { richContent } from '../../types';
import ReactQuill from 'react-quill';
import ValidationIndicator from '../validation-indicator/validation-indicator';
import noop from 'lodash/noop';
import SingleLine from '../single-line/single-line';

class Post extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      showValidation: false,
    };
  }

  showValidation() {
    const { optional } = this.props;
    if (optional) return;
    this.setState({ showValidation: true });
  }

  render() {
    const { value, onChange, placeholder, min, onValidation, validateWith } = this.props;
    const { showValidation } = this.state;
    return (
      <div className={styles.post}>
        <ReactQuill
          className={styles.richContent}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={this.showValidation}
          modules={{
            toolbar: [
              'bold', 'italic', 'underline', 'strike', // toggled buttons
              'blockquote', 'code-block', 'link', 'image',

              { 'header': 1 }, { 'header': 2 }, // custom button values
              { 'list': 'ordered' }, { 'list': 'bullet' },
              { 'script': 'sub' }, { 'script': 'super' }, // superscript/subscript
              { 'indent': '-1' }, { 'indent': '+1' }, // outdent/indent
              { 'direction': 'rtl' }, // text direction

              { 'color': [] }, { 'background': [] }, // dropdown with defaults from theme
              { 'align': [] },

              'clean' // remove formatting button
            ],
          }}
        />
        <ValidationIndicator
          show={showValidation}
          min={min}
          onValidation={onValidation}
          value={value.replace(/<[^>]*>/g, '')} // strip html tags to validate text length
          validateWith={validateWith}
        />
      </div >
    );
  }
}

Post.propTypes = richContent;

SingleLine.defaultProps = {
  onValidation: noop,
};

export default Post;
