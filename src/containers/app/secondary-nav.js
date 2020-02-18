import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class SecondaryNav extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.tabs = ['collections', 'pages'];
  }

  render() {
    const { show, children } = this.props;
    return (
      <div className={cx(styles.secondaryNav, { [styles.show]: show })} >
        {children}
      </div >
    );
  }
}

SecondaryNav.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

const mapStateToProps = state => ({ // eslint-disable-line
});

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SecondaryNav);
