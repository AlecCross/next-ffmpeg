// src/hooks/useConversion.js

import { useState, useEffect } from 'react';
import { useFFmpeg } from './useFFmpeg';
import { getSavedVideo, saveVideoToDB, clearSavedVideo } from '../utils/indexedDB';

const useConversion = (video) => {
  const { ready, progress, progressPercent, webm, convertToWebm } = useFFmpeg();
  const [isConverting, setIsConverting] = useState(false);
  const [savedWebm, setSavedWebm] = useState(null);

  useEffect(() => {
    // Завантажити збережене відео при першому запуску
    getSavedVideo().then((saved) => {
      if (saved) {
        setSavedWebm(URL.createObjectURL(saved));
      }
    });
  }, []);

  const startConversion = () => {
    if (video) {
      setIsConverting(true);
      clearSavedVideo(); // Видаляємо старий результат перед новою конвертацією
      convertToWebm(video);
    }
  };

  useEffect(() => {
    if (progress === 2 && webm) {
      setIsConverting(false);
      fetch(webm) // Отримуємо Blob
        .then(res => res.blob())
        .then(blob => {
          saveVideoToDB(blob); // Зберігаємо в IndexedDB
          setSavedWebm(webm);
        });
    }
  }, [progress, webm]);

  return { ready, progress, progressPercent, webm: savedWebm || webm, isConverting, startConversion };
};

export default useConversion;
