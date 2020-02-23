import auth from '../auth';
import JSON5 from 'json5';
import router from '../redux-router';

export const create = (name, schema) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  firestore.collection('pages').add({
    name,
    permissions: {
      read: 'all',
      write: uid,
    },
    schema: JSON5.stringify(schema),
    data: {},
  }).then(resp => {
    const newId = resp.id;
    firestore.collection('users').doc(uid).set({
      'pages': auth.selectors.userPageIds(state).concat([newId]),
    }, { merge: true });
  });
};

export const duplicate = (pageId, name) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  const userRef = await firestore.collection('users').doc(uid).get();
  const user = userRef.data();
  const docRef = await firestore.collection('pages').doc(pageId).get();
  if (docRef.exists) {
    const resp = await firestore.collection('pages').add(Object.assign({}, {
      ...docRef.data(),
      data: {},
      name,
    }));
    const newId = resp.id;
    firestore.collection('users').doc(uid).set({
      'pages': user.pages.concat([newId]),
    }, { merge: true });
  } else {
    console.warn('No such document!');
  }
};

export const register = idList => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  firestore.collection('users').doc(uid).set({
    'pages': idList,
  }, { merge: true });
};

export const remove = id => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  const docRef = await firestore.collection('pages').doc(id);
  const user = await firestore.collection('users').doc(uid).get();
  const pageList = user.data().pages;
  await docRef.delete();
  user.ref.set({
    'pages': pageList.filter(_id => _id !== id),
  }, { merge: true });
};

export const sortSchema = (id, schema) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const doc = await firestore.collection('pages').doc(id).get();
  if (doc.exists) {
    doc.ref.set({
      'schema': JSON5.stringify(schema),
    }, { merge: true });
  }
};

export const addField = (id, index, field) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const doc = await firestore.collection('pages').doc(id).get();
  if (doc.exists) {
    let schema = JSON5.parse(doc.data().schema);
    if (index >= 0) {
      schema[index] = field;
    } else {
      schema = schema.concat([field]);
    }
    doc.ref.set({
      'schema': JSON5.stringify(schema),
    }, { merge: true });
  }
};

export const deleteField = (id, index) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const firebase = getFirebase();
  const doc = await firestore.collection('pages').doc(id).get();
  let key = null;
  if (doc.exists) {
    const data = doc.data();
    const schema = JSON5.parse(data.schema);
    if (schema[index].type.match(/image|pdf/)) {
      const storageRef = firebase.storage().ref();
      key = `ref--${schema[index].key}`;
      const location = data.data[key];
      if (location) {
        const ref = storageRef.child(location);
        try {
          ref.delete();
        } catch (e) {
          console.error(e);
        }
      }
    }
    schema.splice(index, 1);
    const payload = {
      'schema': JSON5.stringify(schema),
    };
    if (key) {
      delete data.data[key];
      delete data.data[key.replace(/^ref--/, '')];
      payload.data = data.data;
    }
    doc.ref.set(payload, { merge: true });
  }
};

export const sort = order => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  await firestore.collection('users').doc(uid).set({
    'pages': order,
  }, { merge: true });
};

export const rename = newName => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const pageId = router.selectors.pageId(state);
  const doc = firestore.collection('pages').doc(pageId);
  await doc.set({
    'name': newName,
  }, { merge: true });
};

export default {
  create,
  duplicate,
  remove,
  register,
  addField,
  deleteField,
  sortSchema,
  sort,
  rename,
};
