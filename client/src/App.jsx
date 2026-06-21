import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:3000';

function App() {
    const [tracks, setTracks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: ''
    });
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);

    useEffect(() => {
        fetchTracks();
    }, []);

    const fetchTracks = async () => {
        try {
            const response = await axios.get(`${API_BASE}/tracks`);
            setTracks(response.data);
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'audio') setAudioFile(e.target.files[0]);
        if (e.target.name === 'cover') setCoverFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile || !formData.title || !formData.author) {
            alert('Please fill in required fields and select an MP3 file');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('genre', formData.genre);
        data.append('audio', audioFile);
        if (coverFile) data.append('cover', coverFile);

        setLoading(true);
        try {
            await axios.post(`${API_BASE}/upload`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Track uploaded successfully!');
            setFormData({ title: '', author: '', genre: '' });
            setAudioFile(null);
            setCoverFile(null);
            e.target.reset();
            fetchTracks();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload track');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Music Platform</h1>

            <section className="upload-section">
                <h2>Upload New Track</h2>
                <form onSubmit={handleSubmit} className="upload-form">
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Track Title" 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="author" 
                        placeholder="Author" 
                        value={formData.author} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="genre" 
                        placeholder="Genre" 
                        value={formData.genre} 
                        onChange={handleInputChange} 
                    />
                    <div className="file-inputs">
                        <label>
                            MP3 File:
                            <input type="file" name="audio" accept="audio/mpeg" onChange={handleFileChange} required />
                        </label>
                        <label>
                            Cover Image:
                            <input type="file" name="cover" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Track'}
                    </button>
                </form>
            </section>

            <section className="tracks-section">
                <h2>Tracks Library</h2>
                <div className="tracks-grid">
                    {tracks.map(track => (
                        <div key={track.id} className="track-card" onClick={() => setCurrentTrack(track)}>
                            <img 
                                src={track.cover_path ? `${API_BASE}${track.cover_path}` : 'https://via.placeholder.com/150'} 
                                alt={track.title} 
                                className="track-cover"
                            />
                            <div className="track-info">
                                <h3>{track.title}</h3>
                                <p>{track.author}</p>
                                <span className="genre-tag">{track.genre}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {currentTrack && (
                <div className="player-bar">
                    <div className="now-playing">
                        <img 
                            src={currentTrack.cover_path ? `${API_BASE}${currentTrack.cover_path}` : 'https://via.placeholder.com/50'} 
                            alt="cover" 
                        />
                        <div>
                            <strong>{currentTrack.title}</strong>
                            <p>{currentTrack.author}</p>
                        </div>
                    </div>
                    <audio 
                        controls 
                        autoPlay 
                        src={`${API_BASE}${currentTrack.mp3_path}`}
                        key={currentTrack.id}
                    >
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
}

export default App;