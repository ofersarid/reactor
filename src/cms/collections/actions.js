import Activity from '/src/cms/activity/index';
import { uid } from '/src/cms/auth/selectors';

const getEntityById = (collectionId, entityId, firestore) =>
  firestore.collection('collections').doc(collectionId).collection('data').doc(entityId);

const getCollectionById = (collectionId, firestore) =>
  firestore.collection('collections').doc(collectionId).collection('data');

// const deleteFile = (path, firebase) => {
//   if (!path) return;
//   const storageRef = firebase.storage().ref();
//   const oldImageRef = storageRef.child(path);
//   return oldImageRef.delete();
// };

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

// const generateFileName = (file, path) => {
//   const extension = file.name.match(/\.[0-9a-z]+$/i)[0];
//   return `${path}${extension}`;
// };

const uploadFiles = (path, entity, firebase, dispatch) => {
  const keys = [];
  const uploads = Object.keys(entity).reduce((accumulator, key) => {
    if (entity[key] instanceof File) {
      keys.push(key);
      const file = entity[key];
      // const newName = key;
      // accumulator.push({
      //   key,
      //   name: newName,
      //   file,
      // });
      accumulator.push(uploadFile(`${path}/${key}`, file, key, firebase, dispatch));
      return accumulator;
    }
    return accumulator;
  }, []);
  return Promise.all(uploads).then(urls => {
    const update = {};
    urls.forEach((url, index) => {
      update[keys[index]] = url;
      // entity[files[index].key] = url;
      // // deleteFile(entity[`${files[index].key}-storageLocation`], firebase);
      // entity[`${files[index].key}-storageLocation`] = files[index].name;
    });

    /* Set activity - uploadingFiles to false */
    dispatch(Activity.actions.uploadComplete());
    return update;

    // return id
    //   ? getEntityById(collection, id, firestore).set(entity)
    //   : getCollectionById(collection, firestore).add(entity);
  });
};

const update = (uid, entity, entityid, collectionId, firestore, firebase, dispatch) => {
  // const uploads = [];
  // const files = Object.keys(entity).reduce((_files, key) => {
  //   if (entity[key] instanceof File) {
  //     const extension = entity[key].name.match(/\.[0-9a-z]+$/i)[0];
  //     const newName = `${uuidv4()}${extension}`;
  //     _files.push({
  //       key,
  //       name: newName,
  //       file: entity[key],
  //       promise: uploads.push(uploadFile(entity[key], newName, firebase, dispatch)),
  //     });
  //   }
  //   return _files;
  // }, []);
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
  // if (!isEmpty(files)) {
  //   /* Set activity - uploadingFiles to true */
  //   dispatch(Activity.actions.uploadingFiles());
  //
  //   return Promise.all(uploads).then(urls => {
  //     urls.forEach((url, index) => {
  //       entity[files[index].key] = url;
  //       deleteFile(entity[`${files[index].key}-storageLocation`], firebase);
  //       entity[`${files[index].key}-storageLocation`] = files[index].name;
  //     });
  //
  //     /* Set activity - uploadingFiles to false */
  //     dispatch(Activity.actions.uploadComplete());
  //
  //     return id
  //       ? getEntityById(collection, id, firestore).set(entity)
  //       : getCollectionById(collection, firestore).add(entity);
  //   });
  // }
  // return id
  //   ? getEntityById(collection, id, firestore).set(entity)
  //   : getCollectionById(collection, firestore).add(entity);
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
    // const firebase = getFirebase();
    const batch = firestore.batch();
    markedForDelete.forEach(id => {
      batch.delete(getEntityById(collectionId, id, firestore));
      // const entity = entityById(id, collectionId, getState());
      // // delete old image
      // if (entity.imageStorageLocation) {
      //   deleteFile(entity.imageStorageLocation, firebase);
      // }
      // if (entity.pdfStorageLocation) {
      //   deleteFile(entity.pdfStorageLocation, firebase);
      // }
    });
    return batch.commit();
  };
};
