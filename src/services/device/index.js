import { fromJS } from 'immutable';
import React, { PureComponent } from 'react';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const reducer = (state = fromJS({
  type: 'mobile',
  orientation: 'portrait',
}), action) => {
  switch (action.type) {
    case 'DEVICE:CHANGE':
      const type = () => {
        switch (true) {
          case window.innerWidth >= 768 && window.innerWidth <= 1024 && window.innerHeight <= 1024:
            return 'tablet';
          case window.innerWidth > 1024 || (window.innerWidth === 1024 && window.innerHeight > 1024):
            return 'desktop';
          default:
            return 'mobile';
        }
      };
      return fromJS({
        type: type(),
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      });
    default:
      return state;
  }
};

const actions = {
  update: () => ({
    type: 'DEVICE:CHANGE',
  }),
};

const selectors = {
  type: state => state.getIn(['device', 'type']),
  orientation: state => state.getIn(['device', 'orientation']),
};

const HOC = (WrappedComponent) => {
  class Wrapper extends PureComponent {
    constructor(props) {
      super(props);
      autoBind(this);
    }

    componentDidMount() {
      const { update } = this.props;
      update();
      this.bindEvents();
    }

    bindEvents() {
      const { update } = this.props;
      window.addEventListener('orientationchange', () => {
        update();
      });
      window.addEventListener('resize', () => {
        update();
      });
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  Wrapper.propTypes = {
    update: PropTypes.func.isRequired,
  };

  const mapDispatchToProps = dispatch => ({
    update: () => dispatch(actions.update()),
  });

  return connect(() => ({}), mapDispatchToProps)(Wrapper);
};

export default {
  reducer,
  selectors,
  HOC,
};
