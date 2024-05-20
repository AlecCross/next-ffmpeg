import React, { useState, useEffect, useRef } from 'react';
import styles from '../index.module.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import Head from 'next/head';
const ffmpeg = createFFmpeg({ log: true });

export default function Index() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [webm, setWebm] = useState();
  const [progress, setProgress] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const videoUrlRef = useRef(null);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
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

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');
    const data = ffmpeg.FS('readFile', 'out.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
  }

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
    } catch (error) {
      console.error('Error converting to WebM:', error);
      setProgress(0);
    }
  }

  return ready ? (
    <>
      <Head>
        <title>Sticker converter</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <div className={styles.App}>
        <div className={styles["status-message"]}>
          {progress === 0 && (
            <div>
              <div>Create video sticker for Telegram</div>
              <div>Please load video 1:1 ratio and start converting</div>
            </div>
          )}
          {progress === 1 && (
            <div>
              <div>Converting...</div>
              <div>Progress: {Math.round(progressPercent.toFixed(2))}%</div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progress} 
                  style={{ width: `${progressPercent.toFixed(2)}%` }}
                />
              </div>
            </div>
          )}
          {progress === 2 && <div>Finish</div>}
        </div>
        <div className={styles["video-container"]}>
          {video ? (
            <video
              controls
              width="250"
              src={videoUrlRef.current}
            ></video>
          ) : (
            <div className={styles["video-placeholder"]}></div>
          )}
          <input
            type="file"
            onChange={handleVideoUpload}
          />
        </div>
        <div className={styles["result-container"]}>
          {progress === 2 && <h3>Result</h3>}
          <div>You get 512x512 video in .webm VP9 (if original video has 1:1 ratio), without audio, duration 2.99sec</div>
          <button onClick={convertToWebm}>Convert to webm</button>
          {webm && <video src={webm} width="250" controls />}
        </div>
      </div>
    </>
  ) : (
    <p>Loading...</p>
  );
}
