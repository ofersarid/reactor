import Auth from '../../shared/auth';
import assetService from '../asset';
import JSON5 from 'json5';

// const getEntityById = (collectionId, entityId, firestore) =>
//   firestore.collection('collections').doc(collectionId).collection('data').doc(entityId);
//
// const getCollectionById = (collectionId, firestore) =>
//   firestore.collection('collections').doc(collectionId).collection('data');
//
// const deleteFile = (path, firebase) => {
//   const storageRef = firebase.storage().ref();
//   const ref = storageRef.child(path);
//   return ref.delete();
// };
//
// const uploadFile = (path, file, key, firebase, dispatch) => {
//   const storageRef = firebase.storage().ref();
//   const imageRef = storageRef.child(path);
//   // upload new image
//   const task = imageRef.put(file);
//   dispatch(Activity.actions.uploadingFiles());
//   task.on('state_changed', snapshot => {
//     dispatch(Activity.actions.uploadStatus(snapshot, key));
//   }, () => {
//     // Handle unsuccessful uploads
//   });
//   return task.then(snapshot => {
//     return snapshot.ref.getDownloadURL();
//   });
// };
//
// const uploadFiles = (path, entity, firebase, dispatch) => {
//   const keys = [];
//   const uploads = Object.keys(entity).reduce((accumulator, key) => {
//     if (entity[key] instanceof File) {
//       keys.push(key);
//       const file = entity[key];
//       accumulator.push(uploadFile(`${path}/${key}`, file, key, firebase, dispatch));
//       return accumulator;
//     }
//     return accumulator;
//   }, []);
//   return Promise.all(uploads).then(urls => {
//     const update = {};
//     urls.forEach((url, index) => {
//       update[keys[index]] = url;
//       update[`ref--${keys[index]}`] = `${path}/${keys[index]}`;
//     });
//
//     /* Set activity - uploadingFiles to false */
//     dispatch(Activity.actions.uploadComplete());
//     return update;
//   });
// };
//
// const update = (uid, entity, entityid, collectionId, firestore, firebase, dispatch) => {
//   const entityWithoutFiles = Object.keys(entity).reduce((accumulator, key) => {
//     if (entity[key] instanceof File) return accumulator;
//     accumulator[key] = entity[key];
//     return accumulator;
//   }, {});
//   if (entityid) {
//     const entityRef = getEntityById(collectionId, entityid, firestore);
//     entityRef.set(entityWithoutFiles, { merge: true }).then(() => {
//       uploadFiles(`${uid}/${entityid}`, entity, firebase, dispatch).then(update => {
//         entityRef.set(update, { merge: true });
//       });
//     });
//   } else {
//     getCollectionById(collectionId, firestore).add(entityWithoutFiles).then(resp => {
//       uploadFiles(`${uid}/${resp.id}`, entity, firebase, dispatch).then(update => {
//         getEntityById(collectionId, resp.id, firestore).set(update, { merge: true });
//       });
//     });
//   }
// };
//
// export const updateEntity = (entity, id, collection) => {
//   return (dispatch, getState, { getFirebase, getFirestore }) => {
//     const firestore = getFirestore();
//     const firebase = getFirebase();
//     return update(Auth.selectors.uid(getState()), entity, id, collection, firestore, firebase, dispatch);
//   };
// };
//
// export const deleteEntities = (collectionId, markedForDelete) => {
//   return (dispatch, getState, { getFirebase, getFirestore }) => {
//     const firestore = getFirestore();
//     const firebase = getFirebase();
//     const batch = firestore.batch();
//     const filePaths = [];
//     const _blackList = [];
//     markedForDelete.forEach(item => {
//       const entityRef = getEntityById(collectionId, item.id, firestore);
//       _blackList.push(item.id);
//       Object.keys(item).forEach(key => {
//         if (key.match(/^ref--/)) {
//           filePaths.push(item[key]);
//         }
//       });
//       batch.delete(entityRef);
//     });
//     return batch.commit().then(() => {
//       dispatch(blackList.actions.storeBlackList(blackList));
//       filePaths.forEach(path => {
//         deleteFile(path, firebase);
//       });
//     });
//   };
// };
//
// export const createCollection = (name, { type }) => (dispatch, getState, { getFirebase, getFirestore }) => {
//   const firestore = getFirestore();
//   const state = getState();
//   const uid = Auth.selectors.uid(state);
//   firestore.collection('collections').add({
//     name,
//     owner: uid,
//     canRead: 'all',
//     canWrite: 'owner',
//     fields: [],
//     type,
//   }).then(resp => {
//     const newId = resp.id;
//     firestore.collection('users').doc(uid).set({
//       'collections': Auth.selectors.userCollectionIds(state).concat([newId]),
//     }, { merge: true });
//   });
// };

export const remove = id => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = Auth.selectors.uid(state);
  const collectionRef = firestore.collection('collections').doc(id);
  cleanStorage(id);
  collectionRef.delete().then(() => {
    firestore.collection('users').doc(uid).set({
      'collections': Auth.selectors.userCollectionIds(state).filter(_id => _id !== id),
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
  const uid = Auth.selectors.uid(state);
  if (!name) {
    console.error('Missing "name" in prop 1');
    return;
  }
  if (!schema) {
    console.error('Missing "schema" in prop 2');
    return;
  }
  if (!itemTitle) {
    console.error('Missing "itemTitle" in prop 3');
    return;
  }
  if (!itemBody) {
    console.error('Missing "itemBody" in prop 4');
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
      'collections': Auth.selectors.userCollectionIds(state).concat([newId]),
    }, { merge: true });
  });
};

export const duplicate = (collectionId, name) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = Auth.selectors.uid(state);
  const collectionRef = firestore.collection('collections').doc(collectionId);
  collectionRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      firestore.collection('collections').add(Object.assign({}, data, { name })).then(resp => {
        const newId = resp.id;
        firestore.collection('users').doc(uid).set({
          'collections': Auth.selectors.userCollectionIds(state).concat([newId]),
        }, { merge: true }).then(() => {
          const dataCollectionRef = firestore.collection('collections').doc(collectionId).collection('data');
          dataCollectionRef.get().then(snapshot => {
            snapshot.docs.forEach(doc => {
              firestore.collection('collections').doc(newId).collection('data').add(doc.data());
            });
          });
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
  const uid = Auth.selectors.uid(state);
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
