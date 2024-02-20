import React, { useState, useEffect } from 'react';

const Playlist = ({ audioFiles }) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    // Load audio from the first file in the playlist
    if (audioFiles.length > 0) {
      const objectURL = URL.createObjectURL(audioFiles[currentFileIndex]);
      setAudioSrc(objectURL);

      // Clean up URL object
      return () => URL.revokeObjectURL(objectURL);
    }
  }, [audioFiles, currentFileIndex]);

  const handleEnded = () => {
    // Move to the next file in the playlist or loop back to the start
    setCurrentFileIndex((prevIndex) => (prevIndex + 1) % audioFiles.length);
  };

  return (
    <div>
      {audioSrc && (
        <audio controls src={audioSrc} onEnded={handleEnded} autoPlay>
          Your browser does not support the audio element.
        </audio>
      )}
      <ul>
        {audioFiles.map((file, index) => (
          <li key={index} onClick={() => setCurrentFileIndex(index)}>
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;