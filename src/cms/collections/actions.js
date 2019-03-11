import Activity from '/src/cms/activity/index';
import { uid } from '/src/cms/auth/selectors';

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
    return update(uid(getState()), entity, id, collection, firestore, firebase, dispatch);
  };
};

export const deleteEntities = (collectionId, markedForDelete) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const batch = firestore.batch();
    const filePaths = [];
    markedForDelete.forEach(item => {
      const entityRef = getEntityById(collectionId, item.id, firestore);
      Object.keys(item).forEach(key => {
        if (key.match(/^ref--/)) {
          filePaths.push(item[key]);
        }
      });
      batch.delete(entityRef);
    });
    return batch.commit().then(() => {
      filePaths.forEach(path => {
        deleteFile(path, firebase);
      });
    });
  };
};
