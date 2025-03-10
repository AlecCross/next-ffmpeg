// src/hooks/useVideo.js
import { useState } from 'react';

const useVideo = () => {
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0]; // Використовуємо індексацію замість item()
    if (file) {
      setVideo(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };
  

  return { video, videoUrl, handleVideoUpload };
};

export default useVideo;
