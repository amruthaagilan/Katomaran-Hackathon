// src/components/Registration.js
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

const Video = styled.video`
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  background: #000;
`;

const Button = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4caf50;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
`;

const Input = styled.input`
  margin-top: 1rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 500px;
  font-size: 1rem;
`;

export default function Registration() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState("");
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        alert("Could not access camera");
      }
    }
    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  function capture() {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const dataURL = canvas.toDataURL("image/jpeg");
    setCapturedImage(dataURL);
  }

  async function registerFace() {
    if (!capturedImage || !name) {
      alert("Capture an image and enter a name first.");
      return;
    }

    // Convert base64 image to Blob
    const blob = await (await fetch(capturedImage)).blob();
    const formData = new FormData();
    formData.append("image", blob, "face.jpg");
    formData.append("name", name);

    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("Face registered successfully!");
        setCapturedImage(null);
        setName("");
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      alert("Error registering face.");
    }
  }

  return (
    <div>
      <Video ref={videoRef} autoPlay muted />
      <Button onClick={capture}>Capture Photo</Button>

      {capturedImage && <img src={capturedImage} alt="Captured" style={{ maxWidth: "500px", marginTop: "1rem" }} />}

      <Input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <Button onClick={registerFace}>Register Face</Button>
    </div>
  );
}
