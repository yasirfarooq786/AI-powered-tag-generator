import React, { useState } from 'react';
import { generateAltTags } from '../services/crawlerService';
import LoadingSpinner from './LoadingSpinner';

const ImageList = ({ images, setImages, isLoading, setIsLoading }) => {
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerateAltTags = async () => {
    if (images.length === 0) return;

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const updatedImages = await generateAltTags(images);
      setImages(updatedImages);
      setSuccessMessage('ALT tags generated successfully!');
    } catch (err) {
      console.error('Error generating ALT tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAltChange = (index, newAlt) => {
    const updatedImages = [...images];
    updatedImages[index].alt = newAlt;
    setImages(updatedImages);
  };

  if (images.length === 0) {
    return (
      <div className="empty-state">
        <p>Enter a website URL to extract images and generate ALT tags.</p>
      </div>
    );
  }

  return (
    <div className="image-list-container">
      <div className="image-list-header">
        <h2>Found {images.length} Images</h2>
        <button 
          onClick={handleGenerateAltTags} 
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="small" /> : 'Generate ALT Tags with AI'}
        </button>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="image-grid">
        {images.map((img, index) => (
          <div key={index} className="image-card">
            <div className="image-preview">
              <img 
                src={img.src} 
                alt={img.alt || 'No ALT text'} 
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
            <div className="image-details">
              <p className="image-url">{img.src}</p>
              <textarea
                value={img.alt || ''}
                onChange={(e) => handleAltChange(index, e.target.value)}
                placeholder="Enter ALT text..."
                rows={3}
              />
              {img.generatedAlt && !img.alt && (
                <button 
                  className="use-generated-btn"
                  onClick={() => handleAltChange(index, img.generatedAlt)}
                >
                  Use AI Suggestion
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageList;