export const API_BASE_URL = 'http://localhost:3000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-avatar.png';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Add cache-busting parameter to force image refresh
  const timestamp = Date.now();
  return `${API_BASE_URL}/uploads/${imagePath}?t=${timestamp}`;
};
