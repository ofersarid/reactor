import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
// import noop from 'lodash/noop';
import Device from '/src/device';
import autoBind from 'auto-bind';
// import { Filter } from 'styled-icons/boxicons-regular/Filter';
import { SortDown } from 'styled-icons/boxicons-regular/SortDown';
import { Title } from 'styled-icons/material/Title';
import { Description } from 'styled-icons/material/Description';
import { Select } from '/src/elements';
import { Tooltip } from '/src/cms/components';
// import { toCapitalizedWords } from '/src/cms/utils';
import isEqual from 'lodash/isEqual';
import Collections from '/src/cms/collections';
import { filters } from '../../types';
import styles from './styles.scss';
import { updateQuery, updateOrder, resetFilter } from '../../actions';
import { orderBy } from '../../selectors';

class Filters extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = props.filters.reduce((state, fltr) => {
      state[fltr] = '';
      return state;
    }, {});
  }

  componentDidMount() {
    const { updateOrder, sortOptions } = this.props;
    updateOrder(sortOptions[0].value);
  }

  // updateState(val, fltr) {
  //   this.setState({ [fltr]: val });
  // }

  componentDidUpdate(prevProps, prevState) {
    const { updateQuery } = this.props;
    if (!isEqual(prevState, this.state)) {
      updateQuery(this.state);
    }
  }

  // composeOptions() {
  //   // const { sortOptions } = this.props;
  //   // return sortOptions.map(opt => ({
  //     //   value: opt,
  //     //   label: toCapitalizedWords(opt),
  //   // }));
  //   return [];
  // }

  resolveIcon(fltr) {
    switch (fltr) {
      case 'title':
        return <Title className={styles.titleIcon} />;
      case 'description':
        return <Description className={styles.descriptionIcon} />;
      default:
        console.warn('unknown filter type - filters.js');
    }
  }

  // resolvePlaceholder(fltr) {
  //   const { fields } = this.props;
  //   return fields.find(f => f.key === fltr).label;
  // }

  render() {
    const { sortOptions, orderBy, updateOrder, deviceType } = this.props;
    return (
      <Fragment >
        <div className={styles.filters} >
          {/* {!isMobile && filters.map(fltr => ( */}
          {/* <Tooltip key={fltr} className={styles.flexRow} content={`Filter By ${toCapitalizedWords(fltr)}`} > */}
          {/* <Filter className={styles.icon} /> */}
          {/* <Select */}
          {/* className={cx(styles.select)} */}
          {/* options={getOptionsForFilter(fltr)} */}
          {/* placeholder={this.resolvePlaceholder(fltr)} */}
          {/* onInputChange={value => fields.find(f => f.key === fltr).type === 'switch' ? noop() : this.updateState(value, fltr)} */}
          {/* onChange={value => this.updateState(value, fltr)} */}
          {/* allowMissMatch={fields.find(f => f.key === fltr).type !== 'switch'} */}
          {/* value={this.state[fltr]} */}
          {/* isSearchable={fields.find(f => f.key === fltr).type !== 'switch'} */}
          {/* isClearable */}
          {/* /> */}
          {/* </Tooltip > */}
          {/* ))} */}
          <Tooltip content="Sort By" className={styles.flexRow} >
            <SortDown className={cx(styles.icon, styles[`icon-${deviceType}`])} />
            <Select
              className={styles.select}
              options={sortOptions}
              value={orderBy}
              placeholder="Sort By"
              onChange={updateOrder}
            />
          </Tooltip >
        </div >
      </Fragment >
    );
  }
}

Filters.propTypes = filters;

Filters.defaultProps = {
  filters: [],
  options: [],
};

const mapStateToProps = (state, ownProps) => ({
  isMobile: Device.selectors.isMobile(state),
  deviceType: Device.selectors.deviceType(state),
  orderBy: orderBy(state),
  sortOptions: Collections.selectors.getSortOptions(state),
});

const mapDispatchToProps = dispatch => ({
  updateQuery: (...props) => dispatch(updateQuery(...props)),
  updateOrder: (...props) => dispatch(updateOrder(...props)),
  resetFilter: () => dispatch(resetFilter),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
