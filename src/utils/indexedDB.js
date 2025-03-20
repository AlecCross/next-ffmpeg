// src/utils/indexedDB.js

const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('videoDB', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('videos')) {
          db.createObjectStore('videos', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Failed to open IndexedDB');
    });
  };
  
  const saveVideo = (videoBlob, id) => {
    return openDB().then((db) => {
      const transaction = db.transaction('videos', 'readwrite');
      const store = transaction.objectStore('videos');
      store.put({ id, videoBlob });
      return transaction.complete;
    });
  };
  
  const getVideo = (id) => {
    return openDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('videos', 'readonly');
        const store = transaction.objectStore('videos');
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Failed to get video');
      });
    });
  };
  
  export { saveVideo, getVideo };
  