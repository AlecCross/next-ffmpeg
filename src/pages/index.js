import React, { useEffect } from 'react';
import useVideo from '../hooks/useVideo';
import useConversion from '../hooks/useConversion';
import VideoUploader from '../components/VideoUploader';
import VideoPreview from '../components/VideoPreview';
import ConversionStatus from '../components/ConversionStatus';
import ConvertButton from '../components/ConvertButton';
import styles from '../styles/index.module.css';

export default function Index() {
  const { video, videoUrl, handleVideoUpload } = useVideo();
  const { ready, progress, progressPercent, webm, isConverting, startConversion } = useConversion(video);

  useEffect(() => {
    if (progress === 2 && Notification.permission === 'granted') {
      new Notification('Conversion complete', {
        body: 'Your video has been successfully converted to webm.',
        icon: '/icon-512x512.png',
      });
    }
  }, [progress]);

  return (
    <div className={styles.App}>
      <div className={styles['status-message']}>
        <div className={styles.title}>Create video sticker for Telegram</div>
        <ConversionStatus progress={progress} progressPercent={progressPercent} />
      </div>
      <div className={styles['containers-wrapper']}>
        <div>
          <VideoPreview videoUrl={videoUrl} />
          <VideoUploader onFileUpload={handleVideoUpload} />
        </div>
        <div>
          <VideoPreview videoUrl={webm} />
          <ConvertButton onConvert={startConversion} />
        </div>
      </div>
      {progress === 2 && <h3>Result</h3>}
      <div className={styles.description}>
        You get 512x512 video in .webm VP9 (if original video has 1:1 ratio), without audio, duration 2.99sec
      </div>
    </div>
  );
}
