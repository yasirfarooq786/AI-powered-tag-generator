export const crawlWebsite = async (url) => {
  const response = await fetch('http://localhost:5000/api/crawl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to crawl website');
  }
  
  const data = await response.json();
  return data.images;
};

export const generateAltTags = async (images) => {
  const response = await fetch('http://localhost:5000/api/generate-alt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ images }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate ALT tags');
  }
  
  const data = await response.json();
  return data.images;
};