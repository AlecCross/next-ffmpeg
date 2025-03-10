// src/components/VideoPreview.js
import React from 'react';
import styles from '../styles/index.module.css'; // Переконатись, що шлях правильний

const VideoPreview = ({ videoUrl, width = 250 }) => {
  return (
    <div className={styles["video-container"]}>
      {videoUrl ? (
        <video controls width={width} src={videoUrl}></video>
      ) : (
        <div className={styles["video-placeholder"]}>
          <span>Video preview</span>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
