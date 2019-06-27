import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
// import PropTypes from 'prop-types';
import styles from './styles.scss';

class AssetEditor extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (
      <div className={cx(styles.asetEditor)} >AssetEditor</div >
    );
  }
}

AssetEditor.propTypes = {};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(AssetEditor);
