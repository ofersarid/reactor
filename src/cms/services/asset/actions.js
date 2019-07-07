import Activity from '/src/cms/activity';
import Auth from '/src/cms/components/auth';
import Routes from '/src/routes';
// import blackList from '../blacklist';

const getEntityById = (collectionId, entityId, firestore) =>
  firestore.collection('collections').doc(collectionId).collection('data').doc(entityId);

const getCollectionById = (collectionId, firestore) =>
  firestore.collection('collections').doc(collectionId).collection('data');

const deleteFile = (path, firebase) => {
  const storageRef = firebase.storage().ref();
  const ref = storageRef.child(path);
  return ref.delete();
};

const uploadFile = (path, file, key, firebase, dispatch) => {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(path);
  // upload new image
  const task = imageRef.put(file);
  dispatch(Activity.actions.uploadingFiles());
  task.on('state_changed', snapshot => {
    dispatch(Activity.actions.uploadStatus(snapshot, key));
  }, () => {
    // Handle unsuccessful uploads
  });
  return task.then(snapshot => {
    return snapshot.ref.getDownloadURL();
  });
};

const uploadFiles = (path, entity, firebase, dispatch) => {
  const keys = [];
  const uploads = Object.keys(entity).reduce((accumulator, key) => {
    if (entity[key] instanceof File) {
      keys.push(key);
      const file = entity[key];
      accumulator.push(uploadFile(`${path}/${key}`, file, key, firebase, dispatch));
      return accumulator;
    }
    return accumulator;
  }, []);
  return Promise.all(uploads).then(urls => {
    const update = {};
    urls.forEach((url, index) => {
      update[keys[index]] = url;
      update[`ref--${keys[index]}`] = `${path}/${keys[index]}`;
    });

    /* Set activity - uploadingFiles to false */
    dispatch(Activity.actions.uploadComplete());
    return update;
  });
};

const update = (uid, entity, assetId, collectionId, firestore, firebase, dispatch) => {
  const entityWithoutFiles = Object.keys(entity).reduce((accumulator, key) => {
    if (entity[key] instanceof File) return accumulator;
    accumulator[key] = entity[key];
    return accumulator;
  }, {});
  if (assetId) {
    const entityRef = getEntityById(collectionId, assetId, firestore);
    entityRef.set(entityWithoutFiles, { merge: true }).then(() => {
      uploadFiles(`${uid}/${assetId}`, entity, firebase, dispatch).then(update => {
        entityRef.set(update, { merge: true });
      });
    });
  } else {
    getCollectionById(collectionId, firestore).add(entityWithoutFiles).then(resp => {
      uploadFiles(`${uid}/${resp.id}`, entity, firebase, dispatch).then(update => {
        getEntityById(collectionId, resp.id, firestore).set(update, { merge: true });
      });
    });
  }
};

const save = asset => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const state = getState();
    const uid = Auth.selectors.uid(state);
    const collectionId = Routes.selectors.collectionId(state);
    const assetId = asset.id;
    delete asset.id;
    return update(uid, asset, assetId, collectionId, firestore, firebase, dispatch);
  };
};

const _delete = asset => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const state = getState();
    const collectionId = Routes.selectors.collectionId(state);
    const firestore = getFirestore();
    const firebase = getFirebase();
    const filePaths = [];
    const entityRef = getEntityById(collectionId, asset.id, firestore);
    Object.keys(asset).forEach(key => {
      if (key.match(/^ref--/)) {
        filePaths.push(asset[key]);
      }
    });
    return entityRef.delete().then(() => {
      filePaths.forEach(path => {
        return deleteFile(path, firebase);
      });
    });
  };
};

/**
*  OLD IMPLEMENTATION FOR BULK DELETE
***/
// const deleteAsset = (collectionId, markedForDelete) => {
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

export default {
  save,
  delete: _delete,
};
