
// app/_layout.tsx
import React, { useEffect } from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'  // if you need it
import { registerForPushNotifications } from '../utils/anonUserSupabase'
import { AppState } from 'react-native';


export default function RootLayout() {

  useEffect(() => {
    registerForPushNotifications(); 
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') registerForPushNotifications();
    });
    return () => sub.remove();
  }, []);


  
  const scheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })
  if (!loaded) return null
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* this Slot will render either your (tabs) layout or any standalone pages */}
      <Slot />
      
    </ThemeProvider>
  )
}