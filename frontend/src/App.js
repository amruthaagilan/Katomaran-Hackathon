// src/App.js
import React, { useState } from "react";
import styled from "styled-components";
import Registration from "./components/Registration";
import LiveRecognition from "./components/LiveRecognition";
import ChatWidget from "./components/ChatWidget";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: ${({ active }) => (active ? "#4caf50" : "#eee")};
  color: ${({ active }) => (active ? "white" : "#333")};
  border: none;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: #4caf50;
    color: white;
  }
`;

export default function App() {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <Container>
      <Tabs>
        <Tab active={activeTab === "register"} onClick={() => setActiveTab("register")}>
          Registration
        </Tab>
        <Tab active={activeTab === "live"} onClick={() => setActiveTab("live")}>
          Live Recognition
        </Tab>
        <Tab active={activeTab === "chat"} onClick={() => setActiveTab("chat")}>
          Chat
        </Tab>
      </Tabs>

      {activeTab === "register" && <Registration />}
      {activeTab === "live" && <LiveRecognition />}
      {activeTab === "chat" && <ChatWidget />}
    </Container>
  );
}
