import React, { PureComponent, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import LinesEllipsisLoose from 'react-lines-ellipsis/lib/loose';
import moment from 'moment';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Routes from '/src/routes';
import services from '/src/cms/services';
import { Button } from '/src/cms/shared';
import { Add } from 'styled-icons/material/Add';
import styles from './styles.scss';

class Collection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collectionAssets: props.collectionAssets,
      collectionMeta: props.collectionMeta,
      collectionId: props.collectionId,
    };
    props.setGoBackPath('/cms/home');
    if (props.collectionMeta) {
      props.updateAppTitle(props.collectionMeta.name);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { collectionAssets, collectionMeta, collectionId } = nextProps;
    return {
      collectionAssets: collectionAssets || prevState.collectionAssets,
      collectionMeta: collectionMeta || prevState.collectionMeta,
      collectionId: collectionId || prevState.collectionId,
    };
  }

  componentDidUpdate(prevProps) {
    const { collectionMeta, updateAppTitle } = this.props;
    if (!prevProps.collectionMeta && collectionMeta) {
      updateAppTitle(collectionMeta.name);
    }
  }

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
    const { collectionAssets, collectionMeta, collectionId } = this.state;
    return (
      <Fragment >
        {collectionAssets && collectionAssets.map(item => (
          <Button
            key={item.id}
            className={cx(styles.itemWrapper, { [styles.published]: item.published || item.published === undefined })}
            type="white"
            linkTo={`/cms/collection/${collectionId}/editor/${item.id}`}
            justifyContent="start"
          >
            {collectionMeta.layout.title && <div className={styles.itemTitle} >{this.interpolateValue(item, collectionMeta.layout.title)}</div >}
            {collectionMeta.layout.body && (
              <LinesEllipsisLoose
                text={this.interpolateValue(item, collectionMeta.layout.body)}
                maxLine='4'
                lineHeight='24'
                className={styles.itemBody}
              />
            )}
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
  collectionAssets: PropTypes.arrayOf(PropTypes.object),
  collectionMeta: PropTypes.shape({
    layout: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string,
    }),
    name: PropTypes.string.isRequired,
  }),
  setGoBackPath: PropTypes.func.isRequired,
  updateAppTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  collectionId: Routes.selectors.collectionId(state),
  collectionAssets: services.collections.selectors.assets(state),
  collectionMeta: services.collections.selectors.item(state)
});

const mapDispatchToProps = dispatch => ({
  setGoBackPath: path => dispatch(Routes.actions.setGoBackPath(path)),
  updateAppTitle: newTitle => dispatch(services.app.actions.updateAppTitle(newTitle))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Collection);
