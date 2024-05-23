import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/index.module.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export default function Index() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [webm, setWebm] = useState();
  const [progress, setProgress] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const videoUrlRef = useRef(null);

  const loadFFmpeg = async () => {
    try {
      await ffmpeg.load();
      setReady(true);
    } catch (error) {
      console.error('Error loading ffmpeg:', error);
    }
  };

  useEffect(() => {
    loadFFmpeg();
  }, []);


  useEffect(() => {
    const handleConsoleLog = ({ type, message }) => {
      if (type === 'fferr') {
        if (message.includes('frame=') && message.includes('fps=')) {
          const frameInfo = message.split(/\s+/).filter(Boolean);
          const frameIndex = frameInfo.indexOf('frame=');
          if (frameIndex !== -1) {
            const frames = parseInt(frameInfo[frameIndex + 1]);
            setProgressPercent((frames / (30 * 2.99)) * 100); // припускаємо, що 30 кадрів за секунду і 2.99 сек тривалість
          }
        }
      }
    };

    ffmpeg.setLogger(handleConsoleLog);

    return () => {
      ffmpeg.setLogger(null);
    };
  }, []);

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
        body: 'Your video has been successfully converted to webp.',
        icon: '/icon-512x512.png'
      });
    }
  };

  const convertToWebm = async () => {
    setProgress(1);
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    try {
      await ffmpeg.run(
        '-i', 'test.mp4', 
        '-r', '30', 
        '-t', '2.99', 
        '-an', 
        '-c:v', 'libvpx-vp9',
        '-pix_fmt', 'yuva420p', 
        '-vf', 'scale=512:512:force_original_aspect_ratio=decrease',
        '-b:v', '400K',
        'output.webm'
      );

      const data = ffmpeg.FS('readFile', 'output.webm');
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/webm' }));
      setWebm(url);
      setProgress(2);
      console.debug("Notification ")

      console.debug("Not ", showNotification())
      showNotification();
    } catch (error) {
      console.error('Error converting to WebM:', error);
      setProgress(0);
    }
  }

  return ready ? (
    <>
      <div className={styles.App}>
        <div className={styles["status-message"]}>
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
        <div className={styles["containers-wrapper"]}>
          <div>
            <div className={styles["video-container"]}>
              {video ? (
                <video controls width="250" src={videoUrlRef.current}></video>
              ) : (
                <div className={styles["video-placeholder"]}></div>
              )}
            </div>
            <input type="file" onChange={handleVideoUpload} />
          </div>
          <div>
            <div className={styles["video-container"]}>
              {webm ? (
                <video src={webm} width="250" controls />
              ) : (
                <div className={styles["video-placeholder"]}></div>
              )}
            </div>
            <button onClick={convertToWebm}>Convert to webm</button>
          </div>
        </div>
        <div>
          {progress === 2 && <h3>Result</h3>}
          <div className={styles.description}>
            You get 512x512 video in .webm VP9 (if original video has 1:1
            ratio), without audio, duration 2.99sec
          </div>
        </div>
      </div>
    </>
  ) : (
    <p className={styles.App}>Loading...</p>
  );
}
