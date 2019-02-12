import reducers from './reducers';
import * as selectors from './selectors';
import * as actions from './actions';
import Device from './device';

Device.selectors = selectors;
Device.actions = actions;
Device.reducers = reducers;

export default Device;
