import React, { useState, useRef } from 'react';
import styles from '../styles/index.module.css';

const VideoUploader = ({ onFileUpload }) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileUpload({ target: { files: [file] } }); // Передаємо в handleVideoUpload
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`${styles["video-upload-area"]} ${dragging ? styles["dragging"] : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={onFileUpload}
        className={styles["file-input"]}
      />
      <p>{dragging ? "Drop the file here" : "Drag & Drop your video or click to select"}</p>
    </div>
  );
};

export default VideoUploader;
