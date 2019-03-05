import React from 'react';
import { connect } from 'react-redux';
import Device from '/src/cms/device/index';
import Button from '/src/cms/elements/button/index';
import { Download2 } from 'styled-icons/icomoon/Download2';
import { exportToCsv } from '/src/cms/utils';
import Collections from '/src/cms/collections';
import { downloadCsv } from '../types';

const DeleteButton = props => (
  <Button
    noAnimation
    onClick={() => {
      const fieldLabels = props.collection.entity.fields.reduce((fieldLabel, item) => {
        fieldLabel.push(item.label);
        return fieldLabel;
      }, []);
      const fieldKeys = props.collection.entity.fields.reduce((fieldKeys, item) => {
        fieldKeys.push(item.key);
        return fieldKeys;
      }, []);
      const values = props.list.reduce((values, item) => {
        const value = [];
        fieldKeys.forEach(fieldKey => {
          value.push(item[fieldKey].toDate ? item[fieldKey].toDate() : item[fieldKey]);
        });
        values.push(value);
        return values;
      }, []);
      const data = [fieldLabels].concat(values);
      exportToCsv(props.collection.name, data);
    }}
    tip="Download as CSV"
    justIcon={props.isMobile}
  >
    <Download2 />
    {!props.isMobile && <div >Download</div >}
  </Button >
);

DeleteButton.propTypes = downloadCsv;

const mapStateToProps = state => ({
  isMobile: Device.selectors.isMobile(state),
  collection: Collections.selectors.collection(state),
  list: Collections.selectors.filteredOrderedList(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(DeleteButton);
