import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import styles from './styles.scss';
import { richContent } from '../../types';
import ReactQuill from 'react-quill';
import cx from 'classnames';

class Post extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isValid: false,
    };
  }

  componentDidMount() {
    const { validateWith, value } = this.props;
    this.setState({ isValid: validateWith(value) });
  }

  componentDidUpdate() {
    const { validateWith, value } = this.props;
    this.setState({ isValid: validateWith(value) });
  }

  handleOnChange(content) {
    const { onChange, validateWith, required } = this.props;
    onChange(content);
    this.setState({ isValid: validateWith(content) || (!required && content.length === 0) });
  }

  render() {
    const { value, placeholder, max } = this.props;
    const { isValid } = this.state;
    return (
      <div className={styles.post} >
        <ReactQuill
          className={styles.richContent}
          value={value || ''}
          onChange={this.handleOnChange}
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
            clipboard: {
              matchVisual: false,
            },
          }}
        />
        <div className={cx(styles.tip, { [styles.notValid]: !isValid })} >
          ({value.length}/{max})
        </div >
      </div >
    );
  }
}

Post.propTypes = richContent;

export default Post;
