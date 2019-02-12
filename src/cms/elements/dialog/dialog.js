import React, { PureComponent, Fragment } from 'react';
import types from './types';
import ReactDOM from 'react-dom';
import autoBind from 'auto-bind';
import cx from 'classnames';
import Device from '/src/cms/device';
import connect from 'react-redux/es/connect/connect';
import styles from './styles.scss';
import Button from '/src/cms/elements/button';
import Toaster from '/src/cms/elements/toaster';

class Dialog extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    this.to = setTimeout(this.open, 100);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { onClose } = this.props;
    if (!isOpen && prevState.isOpen) {
      setTimeout(() => {
        onClose();
      }, 400);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.to);
  }

  close() {
    this.setState({ isOpen: false });
  }

  open() {
    this.setState({ isOpen: true });
  }

  render() {
    const { header, bodyClass, children, actions, errorMsg, className, deviceType } = this.props;
    const { isOpen } = this.state;
    return ReactDOM.createPortal(
      <div className={cx(styles.pageBlock, className)} onClick={e => {
        e.stopPropagation();
        if (e.target.classList.contains('dark-bg')) {
          this.close();
        }
      }} >
        <div className={cx('dark-bg', styles.darken, isOpen && styles.darkenShow)} />
        <div className={cx('dialog-box', styles.dialog, isOpen && styles.dialogOpen, styles[`dialog-${deviceType}`])} >
          <div className={styles.header} >{header}</div >
          <div className={cx(styles.body, bodyClass)} >
            <Fragment >
              {children}
            </Fragment >
          </div >
          {actions && (
            <div className={styles.footer} >
              <ul className={styles.actionList} >
                {actions.map(action => (
                  <li key={action.label} >
                    <Button
                      onClick={() => {
                        action.onClick();
                        if (action.closeDialog) this.close();
                      }}
                      color={action.color}
                      disable={action.disable}
                    >
                      {action.icon}
                      <span >{action.label}</span >
                    </Button >
                  </li >
                ))}
              </ul >
            </div >
          )}
        </div >
        <Toaster show={Boolean(errorMsg)} >
          {errorMsg}
        </Toaster >
      </div >,
      document.getElementById('root'),
    );
  }
}

Dialog.propTypes = types;

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
});

export default connect(mapStateToProps, {})(Dialog);
