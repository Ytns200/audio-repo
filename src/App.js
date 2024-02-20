import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons';

const AudioPlayer = ({ audioFiles, currentAudioIndex, setCurrentAudioIndex }) => {
  const [audio, setAudio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const newAudio = new Audio(audioFiles[currentAudioIndex] && audioFiles[currentAudioIndex].url ? audioFiles[currentAudioIndex].url : '');
    setAudio(newAudio);

    const playAudio = () => {
      newAudio.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Failed to play audio:', error));
    };

    document.addEventListener('click', playAudio);

    return () => {
      document.removeEventListener('click', playAudio);
      newAudio.pause();
      newAudio.removeEventListener('ended', () => { });
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
    <div style={{ border: '1px solid white', padding: '20px', margin: '20px', maxWidth: '400px' }}>
      <h2>Now Playing: {audioFiles[currentAudioIndex] && audioFiles[currentAudioIndex].name ? audioFiles[currentAudioIndex].name : ''}</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <audio controls autoPlay muted onEnded={() => setIsPlaying(false)}>
          <source src={audioFiles[currentAudioIndex] && audioFiles[currentAudioIndex].url ? audioFiles[currentAudioIndex].url : ""} type="audio/mp3" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  );
};

const App = () => {
  const initialAudioFiles = JSON.parse(localStorage.getItem('audioList')) || [];
  const [audioUpload, setAudioUpload] = useState('');
  const [audioFiles, setAudioFiles] = useState(initialAudioFiles);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(parseInt(localStorage.getItem('currentAudioIndex')) || 0);

  useEffect(() => {
    localStorage.setItem('currentAudioIndex', currentAudioIndex);
  }, [currentAudioIndex]);

  const uploadAudioHandler = () => {
    if (audioUpload === '') return;
    const data = new FormData();
    data.append("file", audioUpload);
    data.append("upload_preset", "ml_default");
    data.append("cloud_name", "djib5oxng");
    data.append("resource_type", "audio");

    fetch("https://api.cloudinary.com/v1_1/dd9cmhunr/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        const newAudioFiles = [...audioFiles, { name: data.original_filename, url: data.url }];
        setAudioFiles(newAudioFiles);
        localStorage.setItem('audioList', JSON.stringify(newAudioFiles));
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const playNext = () => {
    setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % audioFiles.length);
  };

  const playPrevious = () => {
    setCurrentAudioIndex((prevIndex) => (prevIndex - 1 + audioFiles.length) % audioFiles.length);
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #ffcccc, #99ccff)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ border: '1px solid white', padding: '20px' }}>
        <div>
          <input
            type='file'
            onChange={(e) => setAudioUpload(e.target.files[0])}
            style={{
              padding: '5px',
              borderRadius: '5px',
              border: '1px solid #00AB66',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer'
            }}
          />
          <button onClick={uploadAudioHandler} style={{ background: '#00AB66', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '5px', marginLeft: '10px', cursor: 'pointer' }}>Upload Audio</button>
        </div>
        <AudioPlayer
          audioFiles={audioFiles}
          currentAudioIndex={currentAudioIndex}
          setCurrentAudioIndex={setCurrentAudioIndex}
        />
        <div>
          <h3>Playlist</h3>
          <ul>
            {audioFiles.map((audio, index) => (
              <li key={index} onClick={() => setCurrentAudioIndex(index)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faPlay} style={{ fontSize: '18px', color: '#00AB66' }} />
                </button>
                <span style={{ marginLeft: '10px', color: 'white' }}>{audio.name}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={playPrevious} style={{ background: '#00AB66', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faStepBackward} style={{ fontSize: '18px' }} />
            </button>
            <button onClick={playNext} style={{ background: '#00AB66', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faStepForward} style={{ fontSize: '18px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
