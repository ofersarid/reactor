export const authError = state => state.getIn(['auth', 'authError']);
export const working = state => state.getIn(['auth', 'working']);
export const uid = state => state.get('firebase').auth.uid;
export const isLoaded = state => state.get('firebase').auth.isLoaded;
export const permissions = state => state.get('firebase').profile.permissions;
