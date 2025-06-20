import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

const ANON_KEY = 'anonUserId';

export async function getOrCreateAnonUserId() {
  // 1. Check AsyncStorage
  console.log('Getting or creating anon user id');
  let id = await AsyncStorage.getItem(ANON_KEY);
  console.log(`ID is: ${id}`);
  if (id) return id;

  // FIRST TIME USER
  // 1. No stored ID: insert a new row with DEFAULT values, return a scalar id
  const { data: user_id, error: userError } = await supabase.rpc('create_user_and_get_id')
  if (userError || !user_id) {
    console.error('Error creating anon user:', userError);
    return null;
  }
  // 2. Insert settings with DEFAULT values on async storage
  await AsyncStorage.setItem('fontSize', '18');
  await AsyncStorage.setItem('theme', 'light');
  await AsyncStorage.setItem('sureNotification', 'false');
  await AsyncStorage.setItem('readingNotification', 'false');

  id = String(user_id);
  await AsyncStorage.setItem(ANON_KEY, id);
  console.log(`New ID saved on the table is: ${id}`);
  return id;
}

export async function updateFontSize(newSize) {
  try {
  const key = 'fontSize';
  const stored = await AsyncStorage.getItem(key);
  // If no changes made, return 0
  if (stored !== null && Number(stored) === newSize) return 0;
  // If updated. Update Async storage
  await AsyncStorage.setItem(key, String(newSize));
  return 0;
  } catch (error) {
    console.error('Error updating font size:', error);
    return 1;
  }
}

export async function getFontSize() {
  try {
    const fontSize = await AsyncStorage.getItem('fontSize');
    return fontSize ? Number(fontSize) : 18; // Default to 18 if not found
  } catch (error) {
    console.error('Error getting font size:', error);
    return 18; // Default fallback
  }
}

export async function updateTheme(newTheme) {
  try {
  const key = 'theme';
  const stored = await AsyncStorage.getItem(key);
  // If no changes made, return 0
  if (stored !== null && stored === newTheme) return 0;
  // If updated. Update Async storage
  await AsyncStorage.setItem(key, String(newTheme));
  return 0;
  } catch (error) {
    console.error('Error updating theme:', error);
    return 1;
  }
}

export async function getTheme() {
  try {
    const theme = await AsyncStorage.getItem('theme');
    return theme ? theme : 'light'; // Default to 'light' if not found
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light'; // Default fallback
  }
}

export async function updateNotifications(sureNotifBool, readingNotifBool) {
  try {
  const key1 = 'sureNotification';
  const key2 = 'readingNotification';
  await AsyncStorage.setItem(key1, String(sureNotifBool));
  await AsyncStorage.setItem(key2, String(readingNotifBool));
  return 0;
  } catch (error) {
    console.error('Error updating notifications:', error);
    return 1;
  }
}

export async function getNotifications() {
  try {
    const sureNotif = await AsyncStorage.getItem('sureNotification');
    const readingNotif = await AsyncStorage.getItem('readingNotification');
    return { sureNotif: sureNotif === 'true', readingNotif: readingNotif === 'true' };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { sureNotif: false, readingNotif: false }; // Default fallback
  }
}

export async function registerForPushNotifications() {
  if (Device.isDevice) {
    console.log('Must use physical device for push')
    return
  }
  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') {
    console.log('Push permission denied')
    return
  }
  const { data: { data: token } } = await Notifications.getExpoPushTokenAsync()
  console.log('Push token:', token)
  await supabase
    .from('device_tokens')
    .upsert({ token }, { onConflict: 'token' })
}