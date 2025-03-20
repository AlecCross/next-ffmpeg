// src/hooks/useConversion.js

import { useState, useEffect } from 'react';
import { useFFmpeg } from './useFFmpeg';

const useConversion = (video) => {
  const { ready, progress, progressPercent, webm, convertToWebm } = useFFmpeg();
  const [isConverting, setIsConverting] = useState(false);

  const startConversion = () => {
    if (video) {
      setIsConverting(true);
      convertToWebm(video);
    }
  };

  useEffect(() => {
    if (progress === 2) {
      setIsConverting(false);
    }
  }, [progress]);

  return { ready, progress, progressPercent, webm, isConverting, startConversion };
};

export default useConversion;
