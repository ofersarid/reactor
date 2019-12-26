import auth from '../auth';
import JSON5 from 'json5';

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

export const remove = id => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  const docRef = firestore.collection('pages').doc(id);
  docRef.delete().then(() => {
    firestore.collection('users').doc(uid).set({
      'pages': auth.selectors.userCollectionIds(state).filter(_id => _id !== id),
    }, { merge: true });
  });
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
  const doc = await firestore.collection('pages').doc(id).get();
  if (doc.exists) {
    const schema = JSON5.parse(doc.data().schema);
    doc.ref.set({
      'schema': JSON5.stringify(schema.splice(index, 1)),
    }, { merge: true });
  }
};

export default {
  create,
  duplicate,
  remove,
  register,
  addField,
  deleteField,
};
