import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import SearchResults from './SearchResults';
import LoadingIndicator from './LoadingIndicator';
import { searchAcademicData } from '../services/api';

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await searchAcademicData(inputText);
      
      const { data, entities, search_types } = response;
      
      // Format entitas untuk ditampilkan
      const formattedEntities = Object.entries(entities)
        .map(([key, values]) => `${key}: ${values.join(', ')}`)
        .join('\n');
      
      // Format kategori pencarian
      const formattedSearchTypes = search_types.join(', ') || 'tidak diketahui';
      
      // Buat pesan bot dengan informasi baru
      let botText = `Dari teks "${inputText}" saya mengategorikan pencarian untuk data ${formattedSearchTypes}`;
      
      if (Object.keys(entities).length > 0) {
        botText += ` dan mengidentifikasi entitas:\n${formattedEntities}`;
      }
      
      if (data.length === 0) {
        botText += "\n\nMaaf, tidak ada data yang sesuai ditemukan.";
      } else {
        botText += `\n\nBerikut ${data.length} hasil yang ditemukan:`;
      }
      
      const botMessage = { 
        text: botText, 
        sender: 'bot',
        data: data,
        entities: entities,
        searchTypes: search_types
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error("Error dalam handleSubmit:", error);
      
      const errorMessage = {
        text: `Maaf, terjadi kesalahan: ${error.message}`,
        sender: 'bot',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menampilkan contoh pertanyaan
  const showExampleQueries = () => {
    const examples = [
      "Jadwal kuliah Manajemen Proyek IT di GIK L1 A hari ini",
      "Seminar apa saja yang ada di jurusan Ilmu Komputer minggu ini?",
      "Perkuliahan S1 Ilkom hari Rabu di Gedung GIK",
      "Jadwal dosen Bambang Hermanto"
    ];
    
    return (
      <div className="example-queries">
        <p>Contoh pertanyaan:</p>
        <ul>
          {examples.map((example, index) => (
            <li key={index} onClick={() => setInputText(example)}>
              {example}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>Selamat datang di Chatbot Akademik</h3>
            <p>Tanyakan jadwal kuliah atau seminar di jurusan Ilmu Komputer</p>
            {showExampleQueries()}
          </div>
        )}
        
        {messages.map((msg, index) => (
          <Message 
            key={index} 
            message={msg} 
          />
        ))}
        
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tanyakan jadwal kuliah/seminar..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Kirim
        </button>
      </form>
    </div>
  );
};

export default ChatContainer;