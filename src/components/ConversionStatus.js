// src/components/ConversionStatus.js
import React from 'react';
import styles from '../styles/index.module.css';

const ConversionStatus = ({ progress, progressPercent }) => {
  return (
    <div className={styles.statusWrapper}>
      {progress === 0 && <div>Please load video 1:1 ratio and start converting</div>}
      {progress === 1 && (
        <div>
          <div>Converting...</div>
          <div className={styles.progressBar}>
            <meter className={styles.meter} value={progressPercent} min="0" max="100">
              {Math.round(progressPercent)}%
            </meter>
          </div>
        </div>
      )}
      {progress === 2 && <div>Finish</div>}
    </div>
  );
};

export default ConversionStatus;
