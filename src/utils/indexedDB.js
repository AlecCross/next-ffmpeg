// src/utils/indexedDB.js

const DB_NAME = 'videoDB';
const STORE_NAME = 'videos';

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error opening IndexedDB');
  });
};

export const saveVideoToDB = async (blob) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.put(blob, 'convertedVideo');
};

export const getSavedVideo = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('convertedVideo');

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Error retrieving video from IndexedDB');
  });
};

export const clearSavedVideo = async () => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.delete('convertedVideo');
};
