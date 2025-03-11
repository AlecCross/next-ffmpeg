import React, { useState, useEffect } from 'react';
import styles from '../styles/index.module.css';

const VideoUploader = ({ onFileUpload }) => {
  const [dragging, setDragging] = useState(false);
  let dragCounter = 0;

  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter++;
      setDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      dragCounter--;

      // Якщо всі `dragenter` закінчилися, ховаємо оверлей
      if (dragCounter === 0) {
        setDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dragCounter = 0;
      setDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        onFileUpload({ target: { files: [file] } });
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [onFileUpload]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(e);
    }
  };

  return (
    <>
      {dragging && (
        <div className={styles.overlay}>
          <p className={styles.overlayText}>Drop your file here</p>
        </div>
      )}
      <div className={styles.videoUploadArea}>
        <input type="file" accept="video/*" onChange={handleChange} className={styles.fileInput} />
        <p>Drag & Drop your video or click to select</p>
      </div>
    </>
  );
};

export default VideoUploader;
