import React from 'react';
import SearchResults from './SearchResults';

const Message = ({ message }) => {
  return (
    <div className={`message ${message.sender}`}>
      <div className="message-bubble">
        <div className="message-text" style={{ whiteSpace: 'pre-line' }}>
          {message.text}
        </div>
        
        {/* Tampilkan kategori pencarian jika ada */}
        {message.searchTypes && message.searchTypes.length > 0 && (
          <div className="search-types-info">
            <h4>Kategori Pencarian:</h4>
            <div className="search-tags">
              {message.searchTypes.map((type, index) => (
                <span key={index} className="search-tag">
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Tampilkan entitas jika ada */}
        {message.entities && Object.keys(message.entities).length > 0 && (
          <div className="entities-info">
            <h4>Detail Entitas:</h4>
            <div className="entities-grid">
              {Object.entries(message.entities).map(([key, values], index) => (
                <div key={index} className="entity-item">
                  <div className="entity-key">{key}</div>
                  <div className="entity-values">
                    {values.map((value, i) => (
                      <span key={i} className="entity-value">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {message.data && message.data.length > 0 && (
          <SearchResults results={message.data} />
        )}
        
        {message.isError && (
          <div className="error-notice">
            Silakan coba lagi atau hubungi administrator
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;