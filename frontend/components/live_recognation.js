import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

const Video = styled.video`
  width: 100%;
  max-width: 700px;
  border-radius: 8px;
  background: #000;
  position: relative;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 700px;
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

export default function LiveRecognition() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [detecting, setDetecting] = useState(false);

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

  async function detectFaces() {
    if (!videoRef.current) return;

    setDetecting(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const captureFrame = () => {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg");
    };

    const intervalId = setInterval(async () => {
      const imageData = captureFrame();

      try {
        // Send captured frame to backend recognition API
        const blob = await (await fetch(imageData)).blob();
        const formData = new FormData();
        formData.append("image", blob, "frame.jpg");

        const res = await fetch("http://localhost:4000/api/recognize", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        // Clear canvas overlay
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        if (data.results && data.results.length > 0) {
          data.results.forEach(face => {
            const { top, right, bottom, left, name } = face;

            // Draw bounding box
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.strokeRect(left, top, right - left, bottom - top);

            // Draw label background
            ctx.fillStyle = "lime";
            ctx.font = "16px Arial";
            const textWidth = ctx.measureText(name).width;
            ctx.fillRect(left, bottom, textWidth + 10, 20);

            // Draw label text
            ctx.fillStyle = "#000";
            ctx.fillText(name, left + 5, bottom + 16);
          });
        }
      } catch (err) {
        console.error("Recognition error:", err);
      }
    }, 2000); // every 2 seconds

    // Stop detection after 1 minute for demo; remove in production
    setTimeout(() => {
      clearInterval(intervalId);
      setDetecting(false);
    }, 60000);
  }

  return (
    <div>
      <Container>
        <Video ref={videoRef} autoPlay muted />
        <Canvas ref={canvasRef} />
      </Container>

      <Button onClick={detectFaces} disabled={detecting}>
        {detecting ? "Detecting..." : "Start Live Recognition"}
      </Button>
    </div>
  );
}
