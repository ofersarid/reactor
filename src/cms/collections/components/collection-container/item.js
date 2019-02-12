import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Device from '/src/cms/device/index';
import Button from '/src/cms/elements/button/index';
import App from '/src/cms/app/index';
import cx from 'classnames';
import { entityItem } from '../../types';
import styles from './styles.scss';
import ImageAsync from 'react-image-async';
import Puff from '/src/cms/elements/svg-loaders/puff.svg';
import { FileDownload } from 'styled-icons/material/FileDownload';
import { Link } from 'styled-icons/material/Link';
import { SortDown } from 'styled-icons/boxicons-regular/SortDown';
import { Hide } from 'styled-icons/boxicons-solid/Hide';
import { Show } from 'styled-icons/boxicons-solid/Show';
import { toCapitalizedWords } from '/src/cms/utils';
import Filters from '/src/cms/filters/index';
import Tooltip from '/src/cms/elements/tooltip/tooltip';

class Item extends Component {
  componentWillUnmount() {
    this.willUnmount = true;
  }

  getLabel(key) {
    const { fields } = this.props;
    const found = fields.find(field => field.key === key);
    return found ? found.label : null;
  }

  getFieldProp(key, propName) {
    const { fields } = this.props;
    const found = fields.find(field => field.key === key);
    return found ? found[propName] : null;
  }

  getKeysForCardPosition(position) {
    const { fields } = this.props;
    const found = fields.filter(field => field.cmsCardPosition === position);
    return found.map(item => item.key);
  }

  getKeysForBody() {
    const { fields } = this.props;
    const found = fields.filter(field => !['title', 'active', 'displayOrder'].includes(field.key));
    return found.map(item => item.key);
  }

  render() {
    const { markedForDelete, entity, deleteMode, route, markForDelete, icon } = this.props;
    const marked = markedForDelete.includes(entity.id);
    return (
      <Button
        linkTo={!deleteMode ? `${route}/edit/${entity.id}` : null}
        onClick={() => {
          if (deleteMode) {
            markForDelete(entity.id);
          }
        }}
        className={cx(styles.entityBtn)}
      >
        <div
          className={cx(
            styles.entity,
            deleteMode && styles.deleteMode,
            marked && styles.markForDelete,
          )}
        >
          {/* ----- HEADER ----- */}
          <div className={styles.header} >

            {/* ----- TITLE ----- */}
            <div >
              {icon}
              <Tooltip
                content={this.getLabel('title')}
                className={styles.title}
              >
                {entity.title}
              </Tooltip >
            </div >

            {/* ----- TAGS ----- */}
            <div >
              {typeof entity.active === 'boolean' && (
                <Tooltip
                  key="active"
                  className={cx(styles.tag, entity.active ? styles.redTag : styles.inactive)}
                  content={entity.active ? 'Active' : 'Inactive'}
                >
                  {entity.active ? <Show /> : <Hide />}
                </Tooltip >
              )}
              {typeof entity.displayOrder === 'number' && (
                <Tooltip
                  key="displayOrder"
                  className={cx(styles.tag, entity.displayOrder ? styles.blueTag : styles.inactive)}
                  content="Display Order"
                >
                  <SortDown />
                  <div className={styles.displayOrder} >{entity.displayOrder}</div >
                </Tooltip >
              )}
            </div >

          </div >

          {/* ----- BODY ----- */}
          <div className={styles.body} >
            {this.getKeysForBody().map(key => {
              if (!entity[key]) return null;
              let comp = null;
              let type = this.getFieldProp(key, 'type');
              switch (type) {
                case 'post':
                  comp = <div className={styles.post} dangerouslySetInnerHTML={{ __html: entity[key] }} />;
                  break;
                case 'date-time':
                  comp = moment(entity[key].toDate()).format('MMM Do YYYY');
                  break;
                case 'image':
                  comp = <ImageAsync src={[entity[key]]} >
                    {({ loaded, error }) => (
                      <div
                        style={{ backgroundImage: `url(${loaded ? entity[key] : Puff})` }}
                        className={styles.image}
                      />
                    )}
                  </ImageAsync >;
                  break;
                case 'pdf':
                  comp = (
                    <Button
                      key={key}
                      color="green"
                      className={styles.btn}
                      onClick={() => window.open(entity[key])}
                      disable={deleteMode}
                      tip={this.getFieldProp(key, 'label')}
                    >
                      <FileDownload />
                      <div className={styles.link} >{entity[key]}</div >
                    </Button >
                  );
                  break;
                case 'link':
                  comp = (
                    <Button
                      key={key}
                      color="green"
                      className={styles.btn}
                      onClick={() => window.open(key === 'email' ? `mailto:${entity.email}` : entity[key])}
                      disable={deleteMode}
                      tip={this.getFieldProp(key, 'label')}
                    >
                      <Link />
                      <div className={styles.link} >{entity[key]}</div >
                    </Button >
                  );
                  break;
                case 'embed':
                  comp = <iframe src={entity[key]} className={styles.image} frameBorder="0" scrolling="no" />;
                  break;
                case 'switch':
                  comp = <span
                    className={entity[key] ? styles.blue : styles.red} >{toCapitalizedWords(entity[key].toString())}</span >;
                  break;
                default:
                  comp = entity[key];
                  break;
              }

              const isBtn = comp.props && Boolean(comp.props.onClick);

              return isBtn ? comp : (
                <div key={key} className={cx(styles.sectionBox)} >
                  <div className={styles.sectionHeader} >{this.getLabel(key)}</div >
                  {comp}
                </div >
              );
            })}
          </div >
        </div >
      </Button >
    );
  }
}

Item.propTypes = entityItem;

Item.defaltProps = {
  cmsCardPosition: 'body',
};

const mapStateToProps = state => ({
  deviceType: Device.selectors.deviceType(state),
  deviceOrientation: Device.selectors.deviceOrientation(state),
  deleteMode: App.selectors.deleteMode(state),
  markedForDelete: App.selectors.markedForDelete(state),
  orderBy: Filters.selectors.orderBy(state),
});

const mapDispatchToProps = dispatch => ({
  markForDelete: (...props) => dispatch(App.actions.markForDelete(...props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);
