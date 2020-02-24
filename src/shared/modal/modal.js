import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const Modal = ({ children, options, onClick, show }) => ReactDOM.createPortal(
  <div className={cx(styles.modal, { [styles.show]: show })} >
    <div className={styles.container} >
      <section className={styles.content}>{children}</section>
      <ul className={styles.btns} >
        {options.map(opt => (
          <li key={opt} onClick={() => {
            onClick(opt);
          }} >{opt}
          </li >
        ))}
      </ul >
    </div >
  </div >
  , document.getElementById('main'));

Modal.propTypes = {
  children: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default Modal;
