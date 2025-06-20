import { useState, useEffect } from 'react';
import { getFontSize } from '../utils/anonUserSupabase';

export const useFontSize = () => {
  const [fontSize, setFontSize] = useState(18); // Default font size
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFontSize();
  }, []);

  const loadFontSize = async () => {
    try {
      const savedFontSize = await getFontSize();
      setFontSize(savedFontSize);
    } catch (error) {
      console.error('Error loading font size:', error);
    } finally {
      setLoading(false);
    }
  };

  return { fontSize, loading };
}; 