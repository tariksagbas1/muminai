import { useState, useEffect } from 'react';
import { getTheme } from '../utils/anonUserSupabase';
import { themeColors, ThemeType } from '../utils/themeColors';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await getTheme();
      setTheme(savedTheme as ThemeType);
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateThemeState = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  const colors = themeColors[theme];

  return { theme, colors, loading, updateThemeState };
}; 