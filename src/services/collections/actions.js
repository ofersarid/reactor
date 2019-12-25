import auth from '../auth';
import assetService from '../asset';
import JSON5 from 'json5';

export const remove = id => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  const docRef = firestore.collection('collections').doc(id);
  cleanStorage(id);
  docRef.delete().then(() => {
    firestore.collection('users').doc(uid).set({
      'collections': auth.selectors.userCollectionIds(state).filter(_id => _id !== id),
    }, { merge: true });
  });
};

export const clearAllAssets = id => (dispatch, getState, { getFirebase, getFirestore }) => {
  const promise = new Promise(resolve => {
    const firestore = getFirestore();
    // const state = getState();
    firestore.collection(`collections/${id}/data`).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        dispatch(assetService.actions.delete(Object.assign({ id: doc.id }, doc.data())).then());
      });
    });
  });
  return promise;
};

export const cleanStorage = id => (dispatch, getState, { getFirebase, getFirestore }) => {
  const promise = new Promise(resolve => {
    const firestore = getFirestore();
    // const state = getState();
    firestore.collection(`collections/${id}/data`).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        Object.keys(doc).forEach(key => {
          if (key.match(/^ref--/)) {
            dispatch(assetService.actions.deleteFile(doc[key]));
          }
        });
      });
    });
  });
  return promise;
};

export const create = (name, schema, itemTitle, itemBody) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  if (!name) {
    console.error('Missing "name" in prop 1');
    return;
  }
  if (!schema) {
    console.error('Missing "schema" in prop 2');
    return;
  }
  firestore.collection('collections').add({
    name,
    permissions: {
      read: 'all',
      write: uid,
    },
    schema: JSON5.stringify(schema),
    order: '',
    layout: {
      title: itemTitle,
      body: itemBody,
    }
  }).then(resp => {
    const newId = resp.id;
    firestore.collection('users').doc(uid).set({
      'collections': auth.selectors.userCollectionIds(state).concat([newId]),
    }, { merge: true });
  });
};

export const duplicate = (collectionId, name) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  const collectionRef = firestore.collection('collections').doc(collectionId);
  collectionRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      firestore.collection('collections').add(Object.assign({}, data, { name, order: '' })).then(resp => {
        const newId = resp.id;
        firestore.collection('users').doc(uid).set({
          'collections': auth.selectors.userCollectionIds(state).concat([newId]),
        }, { merge: true }).then(() => {
          // const dataCollectionRef = firestore.collection('collections').doc(collectionId).collection('data');
          // dataCollectionRef.get().then(snapshot => {
          //   snapshot.docs.forEach(doc => {
          //     firestore.collection('collections').doc(newId).collection('data').add(doc.data());
          //   });
          // });
        });
      });
    } else {
      console.warn('No such document!');
    }
  });
};

export const register = idList => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  firestore.collection('users').doc(uid).set({
    'collections': idList,
  }, { merge: true });
};

export default {
  create,
  duplicate,
  remove,
  clearAllAssets,
  register,
};
