import { useState } from 'react';

const useVideo = () => {
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoUrl(URL.createObjectURL(file)); // Створюємо тимчасовий URL для перегляду
    }
  };

  return { video, videoUrl, handleVideoUpload };
};

export default useVideo;
