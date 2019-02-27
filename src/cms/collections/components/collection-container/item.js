import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Device from '/src/cms/device/index';
import { Button, Icons, Tooltip } from '/src/cms/elements';
import App from '/src/cms/app/index';
import cx from 'classnames';
import { entityItem } from '../../types';
import styles from './styles.scss';
import ImageAsync from 'react-image-async';
import Puff from '/src/cms/svg-loaders/puff.svg';
import { FileDownload } from 'styled-icons/material/FileDownload';
import { Link } from 'styled-icons/material/Link';
import { SortDown } from 'styled-icons/boxicons-regular/SortDown';
import { Hide } from 'styled-icons/boxicons-solid/Hide';
import { Show } from 'styled-icons/boxicons-solid/Show';
import { toCapitalizedWords } from '/src/cms/utils';
import Routes from '/src/routes';
import Filters from '/src/cms/filters/index';

class Item extends Component {
  componentWillUnmount() {
    this.willUnmount = true;
  }

  getFieldProp(key, propName) {
    const { fields } = this.props;
    const found = fields.find(field => field.key === key);
    return found ? found[propName] : null;
  }

  getKeysForBody() {
    const { entity } = this.props;
    const found = entity.fields.filter(field => !(Object.values(entity.uiKeyMap).concat(['published', 'displayOrder'])).includes(field.key));
    return found.map(item => item.key);
  }

  render() {
    const { markedForDelete, item, deleteMode, pathname, markForDelete, icon, entity } = this.props;
    const marked = markedForDelete.includes(item.id);
    return (
      <Button
        linkTo={!deleteMode ? `${pathname}/edit/${item.id}` : null}
        onClick={() => {
          if (deleteMode) {
            markForDelete(item.id);
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
              <Icons name={icon} />
              <Tooltip
                content={entity.uiKeyMap.title}
                className={styles.title}
              >
                {item[entity.uiKeyMap.title]}
              </Tooltip >
            </div >

            {/* ----- TAGS ----- */}
            <div >
              {typeof item.published === 'boolean' && (
                <Tooltip
                  key="active"
                  className={cx(styles.tag, item.published ? styles.redTag : styles.inactive)}
                  content={item.published ? 'Active' : 'Inactive'}
                >
                  {item.published ? <Show /> : <Hide />}
                </Tooltip >
              )}
              {typeof item.displayOrder === 'number' && (
                <Tooltip
                  key="displayOrder"
                  className={cx(styles.tag, item.displayOrder ? styles.blueTag : styles.inactive)}
                  content="Display Order"
                >
                  <SortDown />
                  <div className={styles.displayOrder} >{item.displayOrder}</div >
                </Tooltip >
              )}
            </div >

          </div >

          {/* ----- BODY ----- */}
          <ul className={styles.body} >
            {this.getKeysForBody().map(key => {
              if (!item[key]) return null;
              let comp = null;
              let type = entity.fields.find(field => field.key === key).type;
              switch (type) {
                case 'post':
                  comp = <div className={styles.post} dangerouslySetInnerHTML={{ __html: item[key] }} />;
                  break;
                case 'date-time':
                  comp = moment(item[key].toDate()).format('MMM Do YYYY');
                  break;
                case 'image':
                  comp = <ImageAsync src={[item[key]]} >
                    {({ loaded, error }) => (
                      <div
                        style={{ backgroundImage: `url(${loaded ? item[key] : Puff})` }}
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
                      onClick={() => window.open(item[key])}
                      disable={deleteMode}
                      tip={item[key]}
                    >
                      <FileDownload />
                      <div className={styles.link} >{item[key]}</div >
                    </Button >
                  );
                  break;
                case 'link':
                  comp = (
                    <Button
                      key={key}
                      color="green"
                      className={styles.btn}
                      onClick={() => window.open(item[key])}
                      disable={deleteMode}
                      tip={item[key]}
                    >
                      <Link />
                      <div className={styles.link} >{item[key]}</div >
                    </Button >
                  );
                  break;
                case 'email':
                  comp = (
                    <Button
                      key={key}
                      color="green"
                      className={styles.btn}
                      onClick={() => window.open(`mailto:${item.email}`)}
                      disable={deleteMode}
                      tip={item[key]}
                    >
                      <Link />
                      <div className={styles.link} >{item[key]}</div >
                    </Button >
                  );
                  break;
                case 'embed':
                  comp = <iframe src={item[key]} className={styles.image} frameBorder="0" scrolling="no" />;
                  break;
                case 'switch':
                  comp = <span
                    className={item[key] ? styles.blue : styles.red} >{toCapitalizedWords(item[key].toString())}</span >;
                  break;
                default:
                  comp = item[key];
                  break;
              }

              const isBtn = comp.props && Boolean(comp.props.onClick);

              return isBtn ? (
                <li>
                  {comp}
                </li>
              ) : (
                <li>
                  <div key={key} className={cx(styles.sectionBox)} >
                    <div className={styles.sectionHeader} >{key}</div >
                    {comp}
                  </div >
                </li>
              );
            })}
          </ul >
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
  pathname: Routes.selectors.pathname(state),
});

const mapDispatchToProps = dispatch => ({
  markForDelete: (...props) => dispatch(App.actions.markForDelete(...props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);
