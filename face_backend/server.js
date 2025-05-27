// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all origins (adjust in prod)
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/face_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Example face registration route
app.post('/api/register', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const imagePath = req.file.path;

    // Call your Python face registration API here
    const response = await axios.post('http://localhost:5000/register', {
      name,
      image_path: imagePath
    });

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Setup WebSocket server for real-time communication
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
    // Broadcast or process message
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});
