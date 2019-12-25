const actions = {
  copyUserSettings: (fromID, toID) => async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const fromDoc = await firestore.collection('users').doc(fromID).get();
    const toDoc = await firestore.collection('users').doc(toID).get();
    if (fromDoc.exists && toDoc.exists) {
      // firestore.collection('users').doc(toID).set({ 'testing': '123' }, { merge: true });
      return toDoc.ref.set(Object.assign({}, fromDoc.data(), toDoc.data()), { merge: true });
    }
  },
  resetPermissions: userID => async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const userDoc = await firestore.collection('users').doc(userID).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      data.collections.forEach(async docID => {
        const colDoc = await firestore.collection('collections').doc('test-collection').get();
        if (colDoc.exists) {
          colDoc.ref.set({
            'permissions': {
              read: 'all',
              write: userID,
            }
          }, { merge: true });
        }
      });
    }
  },
};

export default {
  actions,
};
