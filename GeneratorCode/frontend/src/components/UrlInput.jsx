import React, { useState } from 'react';
import { crawlWebsite } from '../services/crawlerService';
import LoadingSpinner from './LoadingSpinner';

const UrlInput = ({ onImagesFetched, setIsLoading, setError }) => {
  const [url, setUrl] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsCrawling(true);
    setIsLoading(true);
    setError(null);

    try {
      const images = await crawlWebsite(url);
      onImagesFetched(images);
    } catch (err) {
      setError('Failed to crawl website. Please check the URL and try again.');
      console.error(err);
    } finally {
      setIsCrawling(false);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-input-form">
      <div className="input-group">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g., https://example.com)"
          required
          disabled={isCrawling}
        />
        <button type="submit" disabled={isCrawling}>
          {isCrawling ? <LoadingSpinner size="small" /> : 'Extract Images'}
        </button>
      </div>
    </form>
  );
};

export default UrlInput;