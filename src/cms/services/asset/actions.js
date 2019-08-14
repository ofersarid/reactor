// import Activity from '/src/cms/activity';
import Auth from '/src/cms/shared/auth';
import Routes from '/src/routes';
import collectionsService from '../collections';
// import blackList from '../blacklist';

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
            'order': `${orderedList} | ${resp.id}`,
          }, { merge: true }).then(resolve);
          getCollectionAssetRef(collectionId, resp.id, firestore).set(update, { merge: true });
        });
      });
    }
  });
  return promise;
};

const save = asset => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const state = getState();
    const uid = Auth.selectors.uid(state);
    const collectionId = Routes.selectors.collectionId(state);
    const assetId = asset.id || Routes.selectors.pageId(state);
    delete asset.id;
    return update(uid, asset, assetId, collectionId, firestore, firebase, dispatch, state);
  };
};

const _delete = asset => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const state = getState();
    const collectionId = Routes.selectors.collectionId(state);
    const firestore = getFirestore();
    const firebase = getFirebase();
    const filePaths = [];
    const entityRef = getCollectionAssetRef(collectionId, asset.id, firestore);
    Object.keys(asset).forEach(key => {
      if (key.match(/^ref--/)) {
        filePaths.push(asset[key]);
      }
    });
    const promise = new Promise((resolve) => {
      entityRef.delete().then(() => {
        filePaths.forEach(path => {
          return deleteFile(path, firebase);
        });
        const orderedList = collectionsService.selectors.item(state).order.split(' | ');
        firestore.collection('collections').doc(collectionId).set({
          'order': orderedList.filter(id => id !== asset.id,).join(' | '),
        }, { merge: true }).then(() => {
          resolve();
        });
      });
    });
    return promise;
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
//       const entityRef = getCollectionAssetRef(collectionId, item.id, firestore);
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
