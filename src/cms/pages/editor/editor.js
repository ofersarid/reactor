import React, { PureComponent } from 'react';
// import cx from 'classnames';
import { compose } from 'redux';
import { AssetEditor } from '/src/cms/components';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
// import PropTypes from 'prop-types';
// import styles from './styles.scss';

const fields = [];

class Editor extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (
      <AssetEditor fields={fields} />
    );
  }
}

Editor.propTypes = {};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Editor);
