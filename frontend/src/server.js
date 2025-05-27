const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const WebSocket = require("ws");
const path = require("path");
const cors = require("cors");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const FLASK_API_BASE = "http://localhost:5000"; // your Flask API

// Face Registration route
app.post("/api/register", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ success: false, error: "Missing name or image" });
    }

    // Forward multipart/form-data to Flask API
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", new Blob([req.file.buffer], { type: req.file.mimetype }), req.file.originalname);

    const response = await fetch(`${FLASK_API_BASE}/register`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    res.json({ success: response.ok, ...data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Face Recognition route
app.post("/api/recognize", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Missing image" });
    }

    const formData = new FormData();
    formData.append("image", new Blob([req.file.buffer], { type: req.file.mimetype }), req.file.originalname);

    const response = await fetch(`${FLASK_API_BASE}/recognize`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    res.json({ success: response.ok, ...data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Start HTTP server
const server = app.listen(4000, () => {
  console.log("REST API listening on port 4000");
});

// WebSocket server for chat
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    // Echo back message or implement real chat logic here
    const msgObj = JSON.parse(message.toString());
    const reply = {
      text: `You said: "${msgObj.text}". This is a mocked reply.`,
    };
    ws.send(JSON.stringify(reply));
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});
