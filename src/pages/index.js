// src/pages/index.js

import React, { useState, useEffect, useRef } from 'react';
import { useFFmpeg } from '../hooks/useFFmpeg';
import styles from '../styles/index.module.css';

export default function Index() {
  const [video, setVideo] = useState(null);
  const videoUrlRef = useRef(null);

  const { ready, progress, progressPercent, webm, convertToWebm } = useFFmpeg();

  const handleVideoUpload = (event) => {
    const file = event.target.files?.item(0);
    if (file) {
      setVideo(file);
      videoUrlRef.current = URL.createObjectURL(file);
    }
  };

  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Conversion complete', {
        body: 'Your video has been successfully converted to webm.',
        icon: '/icon-512x512.png',
      });
    }
  };

  // Викликається, коли перетворення завершено
  useEffect(() => {
    if (progress === 2) {
      showNotification();
    }
  }, [progress]);

  return ready ? (
    <div className={styles.App}>
      <div className={styles['status-message']}>
        <div className={styles.title}>Create video sticker for Telegram</div>
        {progress === 0 && (
          <div>
            <div>Please load video 1:1 ratio and start converting</div>
            <div className={styles.placeholder}></div>
          </div>
        )}
        {progress === 1 && (
          <div className={styles.statusWrapper}>
            <div>Converting...</div>
            <div className={styles.progressBar}>
              <meter
                className={styles.meter}
                value={progressPercent}
                min="0"
                max="100"
              >
                {Math.round(progressPercent)}%
              </meter>
            </div>
          </div>
        )}
        {progress === 2 && (
          <div>
            <div>Finish</div>
            <div className={styles.placeholder}></div>
          </div>
        )}
      </div>
      <div className={styles['containers-wrapper']}>
        <div>
          <div className={styles['video-container']}>
            {video ? (
              <video controls width="250" src={videoUrlRef.current}></video>
            ) : (
              <div className={styles['video-placeholder']}></div>
            )}
          </div>
          <input type="file" onChange={handleVideoUpload} />
        </div>
        <div>
          <div className={styles['video-container']}>
            {webm ? (
              <video src={webm} width="250" controls />
            ) : (
              <div className={styles['video-placeholder']}></div>
            )}
          </div>
          <button onClick={() => convertToWebm(video)}>Convert to webm</button>
        </div>
      </div>
      <div>
        {progress === 2 && <h3>Result</h3>}
        <div className={styles.description}>
          You get 512x512 video in .webm VP9 (if original video has 1:1
          ratio), without audio, duration 2.99sec
        </div>
      </div>
      <div className={styles.attribution}>
        This application utilizes FFmpeg for video processing. FFmpeg is an
        open-source project available under the LGPL license.
        <div>
          <div>
            <span>LGPL license:</span>
            <a
              className={styles.link}
              href="https://ffmpeg.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about FFmpeg
            </a>
          </div>
          <div>
            <span>Code source:</span>
            <a
              className={styles.link}
              href="https://github.com/ffmpegwasm/ffmpeg.wasm/releases/tag/v0.12.10"
              target="_blank"
              rel="noopener noreferrer"
            >
              View FFmpeg version used (v0.12.10)
            </a>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className={styles.App}>Loading...</p>
  );
}
