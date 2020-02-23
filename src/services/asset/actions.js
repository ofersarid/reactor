// import Activity from '/src/cms/activity';
import auth from '../auth';
import router from '../redux-router';
import collectionsService from '../collections';

const getCollectionAssetRef = (collectionId, entityId, firestore) =>
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
  // dispatch(Activity.actions.uploadingFiles());
  task.on('state_changed', snapshot => {
    // dispatch(Activity.actions.uploadStatus(snapshot, key));
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
    // dispatch(Activity.actions.uploadComplete());
    return update;
  });
};

const update = (uid, entity, assetId, collectionId, firestore, firebase, dispatch, state) => {
  const promise = new Promise(resolve => {
    const entityWithoutFiles = Object.keys(entity).reduce((accumulator, key) => {
      if (entity[key] instanceof File) return accumulator;
      accumulator[key] = entity[key];
      return accumulator;
    }, {});
    if (assetId) {
      let entityRef;
      if (collectionId) {
        // this is an entity from a collection
        entityRef = getCollectionAssetRef(collectionId, assetId, firestore);
      } else {
        // this is a page
        entityRef = firestore.collection('pages').doc(assetId);
      }
      uploadFiles(`${uid}/${assetId}`, entity, firebase, dispatch).then(update => {
        const data = Object.assign({}, entityWithoutFiles, update);
        entityRef.set(collectionId ? data : { data }, { merge: true }).then(resolve);
      });
    } else {
      getCollectionById(collectionId, firestore).add(entityWithoutFiles).then(resp => {
        uploadFiles(`${uid}/${resp.id}`, entity, firebase, dispatch).then(update => {
          const orderedList = collectionsService.selectors.item(state).order;
          firestore.collection('collections').doc(collectionId).set({
            'order': orderedList ? `${orderedList} | ${resp.id}` : resp.id,
          }, { merge: true }).then(resolve);
          getCollectionAssetRef(collectionId, resp.id, firestore).set(update, { merge: true });
        });
      });
    }
  });
  return promise;
};

const save = (asset, assetId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const state = getState();
    const uid = auth.selectors.uid(state);
    const collectionId = router.selectors.collectionId(state);
    return update(uid, asset, assetId, collectionId, firestore, firebase, dispatch, state);
  };
};

const _delete = (asset, id) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const state = getState();
  const collectionId = router.selectors.collectionId(state);
  const firestore = getFirestore();
  const firebase = getFirebase();
  const filePaths = [];
  const entityRef = getCollectionAssetRef(collectionId, id, firestore);
  Object.keys(asset).forEach(key => {
    if (key.match(/^ref--/)) {
      filePaths.push(asset[key]);
    }
  });
  await entityRef.delete();
  filePaths.forEach(async path => {
    await deleteFile(path, firebase);
  });
  let orderedList = collectionsService.selectors.item(state).order;
  if (orderedList) {
    orderedList = orderedList.split(' | ');
    await firestore.collection('collections').doc(collectionId).set({
      'order': orderedList.filter(_id => _id !== id).join(' | '),
    }, { merge: true });
  }
};

export default {
  save,
  delete: _delete,
  deleteFile,
};
