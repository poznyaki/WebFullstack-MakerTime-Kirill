const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure upload directories exist
const uploadDirs = ['static/music', 'static/covers'];
uploadDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'audio') {
            cb(null, path.join(__dirname, 'static/music'));
        } else if (file.fieldname === 'cover') {
            cb(null, path.join(__dirname, 'static/covers'));
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'audio') {
            if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
                cb(null, true);
            } else {
                cb(new Error('Only MP3 files are allowed for audio!'), false);
            }
        } else if (file.fieldname === 'cover') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed for covers!'), false);
            }
        } else {
            cb(null, true);
        }
    }
});

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Routes
app.get('/', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({ success: true, message: 'Server and Database are connected' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all tracks
app.get('/tracks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tracks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload track
app.post('/upload', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
]), async (req, res) => {
    const { title, author, genre } = req.body;
    const audioFile = req.files['audio'] ? req.files['audio'][0] : null;
    const coverFile = req.files['cover'] ? req.files['cover'][0] : null;

    if (!audioFile || !title || !author) {
        return res.status(400).json({ error: 'Title, author and audio file are required' });
    }

    const mp3_path = `/static/music/${audioFile.filename}`;
    const cover_path = coverFile ? `/static/covers/${coverFile.filename}` : null;

    try {
        const [result] = await db.query(
            'INSERT INTO tracks (title, author, mp3_path, cover_path, genre) VALUES (?, ?, ?, ?, ?)',
            [title, author, mp3_path, cover_path, genre || 'Unknown']
        );
        
        res.status(201).json({ 
            success: true, 
            trackId: result.insertId,
            message: 'Track uploaded successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});