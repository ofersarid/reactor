import React, { PureComponent, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Button } from '/src/cms/components';
import { Add } from 'styled-icons/material/Add';
import styles from './styles.scss';

class Collection extends PureComponent {
  render() {
    const { collectionData, collectionMeta } = this.props;
    return (
      <Fragment >
        {collectionData.map(item => (
          <Button
            key={item.id}
            className={cx(styles.itemWrapper, { [styles.published]: item.published || item.published === undefined })}
            type="white"
            linkTo={`/cms/collection/${collectionMeta.id}/editor/${item.id}`}
          >
            <div className={styles.itemTitle} >{item[collectionMeta.layout.title]}</div >
            <div className={styles.itemBody} >{item[collectionMeta.layout.body]}</div >
          </Button >
        ))}
        <Button
          type="circle"
          linkTo={`/cms/collection/${collectionMeta.id}/editor/new`}
        >
          <Add />
        </Button >
      </Fragment >
    );
  }
}

Collection.propTypes = {
  collectionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  collectionMeta: PropTypes.shape({
    id: PropTypes.string.isRequired,
    layout: PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
};

const mapStateToProps = (state) => ({ // eslint-disable-line
  collectionData: [{
    dateTime: '06/20/2019',
    description: 'David P. Taggart et al, A prospective study of external stenting of saphenous vein grafts to the right coronary artery: the VEST II study',
    source: 'European Journal of Cardio-Thoracic Surgery European Journal of Cardio',
    link: 'https://www.thetimes.co.uk/',
    id: '1234',
    published: true,
  }, {
    dateTime: '06/20/2019',
    description: 'David P. Taggart et al, A prospective study of external stenting of saphenous vein grafts to the right coronary artery: the VEST II study',
    source: 'European Journal of Cardio-Thoracic Surgery European Journal of Cardio',
    link: 'https://www.thetimes.co.uk/',
    id: '456',
    published: false,
  }],
  collectionMeta: {
    id: 'asdf342',
    layout: {
      title: 'dateTime',
      body: 'description',
    }
  }
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Collection);
