import React from 'react';
import ChatContainer from './components/ChatContainer';
import './styles.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Chatbot Akademik</h1>
        <p>Sistem Pencarian Informasi Kuliah & Seminar</p>
      </header>
      <ChatContainer />
    </div>
  );
}

export default App;