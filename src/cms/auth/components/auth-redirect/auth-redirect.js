import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Auth from '/src/cms/auth/index';
import { hashHistory } from 'react-router';
import Routes from '/src/routes/index';
import { compose } from 'redux';

class AuthRedirect extends PureComponent {
  constructor(props) {
    super(props);
    this.redirect();
  }

  componentDidUpdate(prevProps) {
    const { uid } = this.props;
    if (uid !== prevProps.uid) {
      this.redirect();
    }
  }

  redirect() {
    const { uid, pathname } = this.props;
    if (!uid) {
      if (pathname !== '/cms/login') {
        if (pathname.match(/^\/cms/)) {
          hashHistory.push('cms/login');
        } else {
          hashHistory.push('website/home');
        }
      }
    } else {
      hashHistory.push('cms');
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

AuthRedirect.propTypes = Auth.types.authRedirect;

const mapStateToProps = state => ({
  uid: Auth.selectors.uid(state),
  pathname: Routes.selectors.pathname(state),
});

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  // firestoreConnect(() => ([{
  //   collection: 'settings',
  //   doc: 'collections',
  // }])),
)(AuthRedirect);
