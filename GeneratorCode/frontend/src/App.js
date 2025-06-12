import React, { useState } from 'react';
import UrlInput from './components/UrlInput';
import ImageList from './components/ImageList';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="container">
      <h1>AI-Powered Image ALT Tag Generator</h1>
      <UrlInput 
        onImagesFetched={setImages}
        setIsLoading={setIsLoading}
        setError={setError}
      />
      {error && <div className="error">{error}</div>}
      <ImageList 
        images={images} 
        setImages={setImages}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}

export default App;