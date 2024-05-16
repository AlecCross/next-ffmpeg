//src/pas

import React, { useState, useEffect } from 'react';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

export default function Index() {
    const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();  
  const [webm, setWebm] = useState();
  const [progress, setProgress] = useState(0);
  const [webmPromise, setWebmPromise] = useState(null); // Define webmPromise state variable

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');
    const data = ffmpeg.FS('readFile', 'out.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url)
  }

  const convertToWebm = async () => {
    setProgress(1);
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    console.log("ffmpeg progress: ", ffmpeg.progress)
    try {
      await ffmpeg.run(
        '-i', 'test.mp4', 
        '-c:v', 'libvpx-vp9', 
        '-b:v', '200k',
        '-pix_fmt', 'yuv420p',
        'output.webm'
      );
      
      // Read the result
      const data = ffmpeg.FS('readFile', 'output.webm');
  
      // Create a URL
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/webm' }));
      setWebm(url);
      setProgress(2);
      console.log("ffmpeg progress: ", ffmpeg.progress)
    } catch (error) {
      console.error('Error converting to WebM:', error);
      setProgress(0);
    }
  }


  console.log("progress ", progress)
  return ready ? (
    <div className="App">
      {progress===0 && <div>Please load video and start converting</div>}
      {progress===1 && <div>Converting...</div>}
      {progress===2 && <div>Finish</div>}
      { video && <video
        controls
        width="250"
        src={URL.createObjectURL(video)}>
      </video>}
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      <h3>Result</h3>
      <button onClick={convertToGif}>Convert to gif</button>
      { gif && <img src={gif} width="250" />}    
      <button onClick={convertToWebm}>Convert to webm</button>
      { webm && <video src={webm} width="250" controls />}
      
    </div>
  )
    :
    (
      <p>Loading...</p>
    );
}