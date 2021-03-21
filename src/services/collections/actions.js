import auth from '../auth';
import router from '../redux-router';
import assetService from '../asset';
import JSON5 from 'json5';

export const clearAllAssets = (id) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  // const state = getState();
  const querySnapshot = await firestore
    .collection(`collections/${id}/data`)
    .get();
  querySnapshot.forEach(async (doc) => {
    await dispatch(
      assetService.actions.delete(
        Object.assign({ id: doc.id }, doc.data()),
        doc.id
      )
    );
  });
};

export const remove = (id) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  const docRef = await firestore.collection('collections').doc(id);
  const user = await firestore.collection('users').doc(uid).get();
  const collectionList = user.data().collections;
  await dispatch(clearAllAssets(id));
  await docRef.delete();
  await user.ref.set(
    {
      collections: collectionList.filter((_id) => _id !== id)
    },
    { merge: true }
  );
};

// export const cleanStorage = id => async (dispatch, getState, { getFirebase, getFirestore }) => {
//   const firestore = getFirestore();
//   // const state = getState();
//   const querySnapshot = await firestore.collection(`collections/${id}/data`).get();
//   querySnapshot.forEach(doc => {
//     Object.keys(doc).forEach(key => {
//       if (key.match(/^ref--/)) {
//         dispatch(assetService.actions.deleteFile(doc[key]));
//       }
//     });
//   });
// };

export const create = (name, schema, itemTitle, itemBody) => (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
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
  firestore
    .collection('collections')
    .add({
      name,
      permissions: {
        read: 'all',
        write: uid
      },
      schema: JSON.stringify(schema),
      order: '',
      layout: {
        title: itemTitle,
        body: itemBody
      }
    })
    .then((resp) => {
      const newId = resp.id;
      firestore
        .collection('users')
        .doc(uid)
        .set(
          {
            collections: auth.selectors.userCollectionIds(state).concat([newId])
          },
          { merge: true }
        );
    });
};

export const duplicate = (collectionId, name) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  const doc = await firestore.collection('collections').doc(collectionId).get();
  if (doc.exists) {
    const data = doc.data();
    const resp = await firestore
      .collection('collections')
      .add(Object.assign({}, data, { name, order: '' }));
    const newId = resp.id;
    console.log(`Created new Collection: ${newId}`);
    await firestore
      .collection('users')
      .doc(uid)
      .set(
        {
          collections: auth.selectors.userCollectionIds(state).concat([newId])
        },
        { merge: true }
      );
    return newId;
  } else {
    console.warn('No such document!');
  }
};

export const register = (idList) => (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  firestore.collection('users').doc(uid).set(
    {
      collections: idList
    },
    { merge: true }
  );
};

export const sortAssets = (id, order) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const doc = await firestore.collection('collections').doc(id).get();
  if (doc.exists) {
    await doc.ref.set(
      {
        order: order
      },
      { merge: true }
    );
  }
};

export const sortSchema = (id, schema) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const doc = await firestore.collection('collections').doc(id).get();
  if (doc.exists) {
    doc.ref.set(
      {
        schema: JSON.stringify(schema)
      },
      { merge: true }
    );
  }
};

export const addField = (id, index, field) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const doc = await firestore.collection('collections').doc(id).get();
  if (doc.exists) {
    let schema = JSON5.parse(doc.data().schema);
    if (index >= 0) {
      schema[index] = field;
    } else {
      schema = schema.concat([field]);
    }
    doc.ref.set(
      {
        schema: JSON.stringify(schema)
      },
      { merge: true }
    );
  }
};

export const deleteField = (id, index) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  console.error('not supported yet');
  return;
  /* eslint-disable */
  const firestore = getFirestore();
  const doc = await firestore.collection('pages').doc(id).get();
  if (doc.exists) {
    const data = doc.data();
    const schema = JSON5.parse(data.schema);
    schema.splice(index, 1);
    doc.ref.set(
      {
        schema: JSON.stringify(schema)
      },
      { merge: true }
    );
    const snapshot = await doc.collection('data').get();
    snapshot.docs.forEach((doc) => {
      const assetData = doc.data();
      // TBD
    });
    /* eslint-enable */
  }
};

export const sort = (order) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = auth.selectors.uid(state);
  const doc = firestore.collection('users').doc(uid);
  await doc.set(
    {
      collections: order
    },
    { merge: true }
  );
};

export const rename = (newName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const state = getState();
  const collectionId = router.selectors.collectionId(state);
  const doc = firestore.collection('collections').doc(collectionId);
  await doc.set(
    {
      name: newName
    },
    { merge: true }
  );
};

export const limitItems = (maxItems) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  if (maxItems !== 0) {
    const firestore = getFirestore();
    const state = getState();
    const collectionId = router.selectors.collectionId(state);
    const doc = firestore.collection('collections').doc(collectionId);
    await doc.set(
      {
        maxItems
      },
      { merge: true }
    );
  }
};

export default {
  create,
  duplicate,
  remove,
  clearAllAssets,
  register,
  addField,
  deleteField,
  sortSchema,
  sortAssets,
  sort,
  rename,
  limitItems
};
