import { PureComponent } from 'react';
import currentDevice from 'current-device';
import { storeOrientation } from './actions';
import types from './types';
import connect from 'react-redux/es/connect/connect';

class Device extends PureComponent {
  constructor(props) {
    super(props);
    currentDevice.onChangeOrientation(newOrientation => {
      props.storeOrientation(newOrientation);
    });
  }

  render() {
    return null;
  }
}

Device.propTypes = types;

const mapDispatchToProps = dispatch => ({
  storeOrientation: (...props) => dispatch(storeOrientation(...props)),
});

export default connect(() => ({}), mapDispatchToProps)(Device);
