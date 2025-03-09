import { useState, useEffect, useRef } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export function useFFmpeg() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [webm, setWebm] = useState(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        await ffmpeg.load();
        setReady(true);
      } catch (error) {
        console.error('Error loading ffmpeg:', error);
      }
    };
    loadFFmpeg();
  }, []);

  useEffect(() => {
    const handleConsoleLog = ({ type, message }) => {
      if (type === 'fferr' && message.includes('frame=')) {
        const frameInfo = message.split(/\s+/).filter(Boolean);
        const frameIndex = frameInfo.indexOf('frame=');
        if (frameIndex !== -1) {
          const frames = parseInt(frameInfo[frameIndex + 1]);
          setProgressPercent((frames / (30 * 2.99)) * 100);
        }
      }
    };

    ffmpeg.setLogger(handleConsoleLog);

    return () => {
      ffmpeg.setLogger(null);
    };
  }, []);

  const convertToWebm = async (video) => {
    if (!video) return;

    setProgress(1);
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(video));

    try {
      await ffmpeg.run(
        '-i', 'input.mp4',
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
      setWebm(URL.createObjectURL(new Blob([data.buffer], { type: 'video/webm' })));
      setProgress(2);
    } catch (error) {
      console.error('Error converting to WebM:', error);
      setProgress(0);
    }
  };

  return { ready, progress, progressPercent, webm, convertToWebm };
}
