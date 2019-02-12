import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Auth from '/src/cms/auth/index';
import { hashHistory } from 'react-router';
import Routes from '/src/routes/index';
import { compose } from 'redux';
import { COLLECTIONS } from '/collections.config';
// import { firestoreConnect } from 'react-redux-firebase';

class AuthRedirect extends PureComponent {
  constructor(props) {
    super(props);
    this.allowdPages = (COLLECTIONS.reduce((list, item) => {
      list.push(item.id);
      return list;
    }, [])).concat(['general-assets']);
    this.redirect(props);
  }

  componentDidUpdate(prevProps) {
    const { pathname } = this.props;
    if (pathname !== prevProps.pathname) {
      this.redirect();
    }
  }

  redirect(props) {
    const { uid, pathname } = props || this.props;
    if (!uid) {
      hashHistory.push('login');
    } else if (
      (uid && pathname === '/cms') ||
      (uid && pathname === '/login')) {
      this.toCMSIndex();
    } else if (uid) {
      const pageAllowed = this.allowdPages.includes(pathname.split('cms/').pop().split('/')[0].toLowerCase());
      if (!pageAllowed) {
        this.toCMSIndex();
      }
    }
  }

  toCMSIndex() {
    const defaultCollection = this.allowdPages[0];
    if (defaultCollection) {
      hashHistory.push(`cms/${defaultCollection}`);
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
