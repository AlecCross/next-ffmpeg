// src/components/VideoUploader.js
import React, { useState } from 'react';
import styles from '../styles/index.module.css';

const VideoUploader = ({ onFileUpload }) => {
  const [dragging, setDragging] = useState(false);

  // Обробка початку перетягування
  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  // Обробка завершення перетягування
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  // Обробка того, коли файли потрапляють в область
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0]; // Вибір першого файлу
    if (file) {
      onFileUpload({ target: { files: [file] } }); // Викликає функцію для обробки завантаження
    }
  };

  // Обробка вибору файлу через кнопку
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(e); // Викликає функцію для обробки завантаження
    }
  };

  return (
    <div
      className={`${styles["video-upload-area"]} ${dragging ? styles["dragging"] : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()} // Це дозволяє події drop працювати
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="video/*"
        onChange={handleChange}
        className={styles["file-input"]}
      />
      {/* <p>{dragging ? "Drop the file here" : "Drag & Drop your video or click to select"}</p> */}
    </div>
  );
};

export default VideoUploader;
