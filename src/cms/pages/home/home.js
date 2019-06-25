import React from 'react';
import cx from 'classnames';
import { Trail, animated } from 'react-spring/renderprops';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, SwitchItem, Button } from '/src/cms/components';
import PropTypes from 'prop-types';
import services from '/src/cms/services';
import styles from './styles.scss';

const listToIndex = list => {
  switch (list) {
    case 'pages':
      return 1;
    default:
      return 0;
  }
};

const collections = [{
  name: 'Publications - FRAME',
}, {
  name: 'Resources - FRAME',
}, {
  name: 'Trials - FRAME',
}];

const pages = [{
  name: 'FRAME',
}];

const Home = ({ list, selectList }) => {
  return (
    <div className={cx(styles.home)} >
      <Switch indicateIndex={listToIndex(list)} className={styles.switch} >
        <SwitchItem onClick={() => selectList('collections')} >Collections</SwitchItem >
        <SwitchItem onClick={() => selectList('pages')} >Pages</SwitchItem >
      </Switch >
      <div className={cx(styles.listContainer, {
        [styles.focus]: list === 'collections',
      })} >
        <Trail
          native
          items={collections}
          keys={item => item.name}
          from={list === 'collections' ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
          to={list === 'collections' ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
        >
          {item => (springs) => ( // eslint-disable-line
            <animated.div key={item.name} className={styles.listItemWrap} style={{
              opacity: springs.opacity,
              transform: springs.x.interpolate(x => `translate3d(${x}%,0,0)`),
            }} >
              <Button onClick={console.log} type="white" >
                {item.name}
              </Button >
            </animated.div >
          )}
        </Trail >
      </div >
      <div className={cx(styles.listContainer, {
        [styles.focus]: list === 'pages',
      })} >
        <Trail
          native
          items={pages}
          keys={item => item.name}
          from={list === 'pages' ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
          to={list === 'pages' ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
        >
          {item => (springs) => ( // eslint-disable-line
            <animated.div key={item.name} className={styles.listItemWrap} style={{
              opacity: springs.opacity,
              transform: springs.x.interpolate(x => `translate3d(${x}%,0,0)`),
            }} >
              <Button onClick={console.log} type="white" >
                {item.name}
              </Button >
            </animated.div >
          )}
        </Trail >
      </div >
    </div >
  );
};

Home.propTypes = {
  selectList: PropTypes.func.isRequired,
  list: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  list: services.home.selectors.list(state),
});

const mapDispatchToProps = dispatch => ({
  selectList: (...props) => dispatch(services.home.actions.selectList(...props)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Home);
