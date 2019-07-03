import React, { PureComponent, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Routes from '/src/routes';
import services from '/src/cms/services';
import { Button } from '/src/cms/components';
import { Add } from 'styled-icons/material/Add';
import styles from './styles.scss';

class Collection extends PureComponent {
  interpolateValue(item, property) {
    let value = item[property];
    if (typeof value === 'string') {
      return value;
    } else if (value.toDate) {
      return moment(value.toDate()).format('MMM Do YYYY');
    }
    return 'error: could not interpolate value';
  }

  render() {
    const { collectionData, collectionMeta, collectionId } = this.props;
    return (
      <Fragment >
        {collectionData.map(item => (
          <Button
            key={item.id}
            className={cx(styles.itemWrapper, { [styles.published]: item.published || item.published === undefined })}
            type="white"
            linkTo={`/cms/collection/${collectionId}/editor/${item.id}`}
            justifyContent="start"
          >
            <div className={styles.itemTitle} >{this.interpolateValue(item, collectionMeta.layout.title)}</div >
            <div className={styles.itemBody} >{this.interpolateValue(item, collectionMeta.layout.body)}</div >
          </Button >
        ))}
        <Button
          type="circle"
          linkTo={`/cms/collection/${collectionId}/editor/new`}
        >
          <Add />
        </Button >
      </Fragment >
    );
  }
}

Collection.propTypes = {
  collectionId: PropTypes.string,
  collectionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  collectionMeta: PropTypes.shape({
    layout: PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }).isRequired
  }),
};

const mapStateToProps = (state) => ({
  collectionId: Routes.selectors.collectionId(state),
  collectionData: services.collections.selectors.data(state),
  collectionMeta: services.collections.selectors.item(state)
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Collection);
