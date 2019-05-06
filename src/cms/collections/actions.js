import Activity from '/src/cms/activity';
import Auth from '/src/cms/auth';
import App from '../app';

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

const update = (uid, entity, entityid, collectionId, firestore, firebase, dispatch) => {
  const entityWithoutFiles = Object.keys(entity).reduce((accumulator, key) => {
    if (entity[key] instanceof File) return accumulator;
    accumulator[key] = entity[key];
    return accumulator;
  }, {});
  if (entityid) {
    const entityRef = getEntityById(collectionId, entityid, firestore);
    entityRef.set(entityWithoutFiles, { merge: true }).then(() => {
      uploadFiles(`${uid}/${entityid}`, entity, firebase, dispatch).then(update => {
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

export const updateEntity = (entity, id, collection) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    return update(Auth.selectors.uid(getState()), entity, id, collection, firestore, firebase, dispatch);
  };
};

export const deleteEntities = (collectionId, markedForDelete) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const batch = firestore.batch();
    const filePaths = [];
    const ids = [];
    markedForDelete.forEach(item => {
      const entityRef = getEntityById(collectionId, item.id, firestore);
      Object.keys(item).forEach(key => {
        if (key.match(/^ref--/)) {
          filePaths.push(item[key]);
          ids.push(item.id);
        }
      });
      batch.delete(entityRef);
    });
    return batch.commit().then(() => {
      dispatch(App.actions.storeBlackList(ids));
      filePaths.forEach(path => {
        deleteFile(path, firebase);
      });
    });
  };
};

export const createCollection = (name, { type }) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore();
  const state = getState();
  const uid = Auth.selectors.uid(state);
  firestore.collection('collections').add({
    name,
    owner: uid,
    canRead: 'all',
    canWrite: 'owner',
    fields: [],
    type,
  }).then(resp => {
    const newId = resp.id;
    firestore.collection('users').doc(uid).set({
      'collections': Auth.selectors.userCollectionIds(state).concat([newId]),
    }, { merge: true });
  });
};
