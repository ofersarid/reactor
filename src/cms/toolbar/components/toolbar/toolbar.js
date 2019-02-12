import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device';
import styles from './styles.scss';
import { toolbar } from '../../types';
import AddButton from '../add-button/add-button';
import DownloadCsv from '../download-csv/download-csv';
import DeleteButton from '../delete-button/delete-button';
import { Filters } from '/src/cms/filters';

const ToolbarContainer = props => (
  <div className={styles.toolbar} >
    <div className={styles.left} >
      {props.addRoute && <AddButton addRoute={props.addRoute} />}
      {props.onClickDelete && <DeleteButton onClickDelete={props.onClickDelete} />}
      {props.onClickDownload && <DownloadCsv onClickDownload={props.onClickDownload} />}
    </div >
    <div className={styles.right} >
      {props.filters && props.filters.length > 0 && (
        <Filters
          filters={props.filters}
          sortOptions={props.sortOptions}
          collection={props.collection}
          fields={props.fields}
        />
      )}
    </div >
  </div >
);

ToolbarContainer.propTypes = toolbar;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(ToolbarContainer);
