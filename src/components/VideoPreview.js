import React from 'react';
import styles from '../styles/index.module.css';

const VideoPreview = ({ videoUrl, width = 250 }) => {
  return (
    <div className={styles["video-container"]}>
      {videoUrl && videoUrl.length > 0 ? (
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
