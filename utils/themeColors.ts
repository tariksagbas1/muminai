export const themeColors = {
  light: {
    // Background colors
    background: 'white',
    background_accent: 'rgb(245, 255, 246)',
    background_accent_2: 'rgb(248, 255, 248)',
    surface: '#f9f9f9',
    card: '#ffffff',
    header: 'rgb(255, 255, 255)',
    
    // Text colors
    primaryText: '#111111',
    secondaryText: '#666666',
    tertiaryText: '#6b7280',
    accentText: 'rgb(0, 119, 44)',
    
    // Border and divider colors
    border: '#f0f0f0',
    divider: '#eee',
    theme_bg: 'rgb(232, 246, 237)',
    
    // Interactive elements
    primary: 'rgb(0, 144, 53)',
    icon_bg: 'rgb(232, 246, 237)',
    secondary: '#16a34a',
    success: '#34c759',
    disabled: '#e5e5ea',
    button_color: 'rgb(14, 21, 17)',
    button_color2: 'rgb(0, 28, 12)',
    
    // Special colors
    arabicText: '#111111',
    mealText: '#222222',
    tefsirText: '#228b22',
    storyText: '#222222',
    
    // Shadow
    shadow: '#000000',
  },
  
  dark: {
    // Background colors
    background: '#121212',
    background_accent: 'rgb(21, 21, 21)',
    background_accent_2: 'rgb(43, 43, 43)',
    surface: '#1e1e1e',
    card: 'rgb(31, 31, 31)',
    header: '#121212',
    
    // Text colors
    primaryText: '#ffffff',
    secondaryText: '#b0b0b0',
    tertiaryText: '#888888',
    accentText: '#4ade80',
    
    // Border and divider colors
    border: '#404040',
    divider: '#333333',
    theme_bg: '#4ade80' + '20',
    
    // Interactive elements
    primary: '#4ade80',
    icon_bg: '#4ade80' + '20',
    secondary: '#22c55e',
    success: '#34c759',
    disabled: '#404040',
    button_color: 'rgb(248, 255, 251)',
    button_color2: 'black',
    
    // Special colors
    arabicText: '#ffffff',
    mealText: '#e0e0e0',
    tefsirText: '#4ade80',
    storyText: '#e0e0e0',
    
    // Shadow
    shadow: '#000000',
  },
  
  grey: {
    // Background colors - warmer, more muted tones
    background: 'rgb(249, 247, 245)',
    background_accent: 'rgb(246, 243, 239)',
    background_accent_2: 'rgb(255, 252, 250)',
    surface: '#e8e4df',
    card: 'rgb(246, 242, 237)',
    header: 'rgb(238, 234, 229)',
    
    // Text colors - warmer browns and greys
    primaryText: '#3d3528',
    secondaryText: '#6b5f4f',
    tertiaryText: '#8a7f6e',
    accentText: '#2d5a2d',
    
    // Border and divider colors - warmer tones
    border: '#d4c9b8',
    divider: '#c4b9a8',
    theme_bg: '#2d5a2d' + '20',
    
    // Interactive elements - muted green
    primary: '#2d5a2d',
    icon_bg: '#2d5a2d' + '20',
    secondary: '#1e3d1e',
    success: '#2d5a2d',
    disabled: '#b8ada0',
    button_color: 'rgb(0, 28, 12)',
    button_color2: 'rgb(0, 28, 12)',
    
    // Special colors - warmer tones
    arabicText: '#3d3528',
    mealText: '#4a4030',
    tefsirText: '#2d5a2d',
    storyText: '#4a4030',
    
    // Shadow
    shadow: '#000000',
  },
};

export type ThemeType = 'light' | 'dark' | 'grey'; 