import React, { useState, useEffect } from 'react';

const AudioPlayer = ({ audioFiles, currentAudioIndex, setCurrentAudioIndex }) => {
  const [audio, setAudio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const newAudio = new Audio(audioFiles[currentAudioIndex].url);
    setAudio(newAudio);

    // Wait for the user interaction before playing audio
    const playAudio = () => {
      newAudio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Failed to play audio:', error);
        });
    };

    document.addEventListener('click', playAudio);

    // Cleanup event listener
    return () => {
      document.removeEventListener('click', playAudio);
      newAudio.pause();
      newAudio.removeEventListener('ended', () => {});
    };
  }, [currentAudioIndex, audioFiles]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <h2>Now Playing: {audioFiles[currentAudioIndex].name}</h2>
      <div>
        <audio controls autoPlay onEnded={() => setIsPlaying(false)}>
          <source src={audioFiles[currentAudioIndex].url} type="audio/mp3" />
          Your browser does not support the audio tag.
        </audio>
        <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
    </div>
  );
};

export default AudioPlayer;
