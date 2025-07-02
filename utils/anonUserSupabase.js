import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { supabase } from './supabaseClient';

const ANON_KEY = 'anonUserId';

export async function getOrCreateAnonUserId() {
  // 1. Check AsyncStorage
  let id = await AsyncStorage.getItem(ANON_KEY);
  console.log(`User ID: ${id}`);
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
  await AsyncStorage.setItem('tone', 'light');

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

export async function updateNotifications(Bool) {
  if (Bool) {
    // 1) check OS permission
    const { status: existing } = await Notifications.getPermissionsAsync();
  
    if (existing !== 'granted') {
        Linking.openSettings();
        return 1;
      }
    
    // 2) now it’s safe to get a token
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    await supabase
      .from('device_tokens')
      .upsert({ token, notifs_enabled: true }, { onConflict: ['token'] });
    return 0;
  }
  else {
    // If user has permission, but wants to disable notifications
    const { status: existing } = await Notifications.getPermissionsAsync();

    if (existing === 'granted') {
      const { data: token } = await Notifications.getExpoPushTokenAsync();
      await supabase
      .from('device_tokens')
      .upsert({ token, notifs_enabled: false }, { onConflict: ['token'] });
    return 0;
    }
    else {
      return 1;
    }
  }
}

export async function getNotifications() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  
  if (existing === 'granted') {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    const { data: record, error } = await supabase
    .from('device_tokens')
    .select('notifs_enabled')
    .eq('token', token)
    .single();

  if (error) throw error;
  return record.notifs_enabled; // Returns true if enabled, false if disabled
  }
  else {
    return false; // Notifications have been disabled from the OS
  }
}

export async function updateTone(newTone) {
  try {
  const key = 'tone';
  const stored = await AsyncStorage.getItem(key);
  // If no changes made, return 0
  if (stored !== null && stored === newTone) return 0;
  // If updated. Update Async storage
  await AsyncStorage.setItem(key, String(newTone));
  return 0;
  } catch (error) {
    console.error('Error updating tone:', error);
    return 1;
  }
}

export async function getTone() {
  try {
    const tone = await AsyncStorage.getItem('tone');
    return tone ? tone : 'light'; // Default to 'light' toning
  } catch (error) {
    console.error('Error getting tone:', error);
    return 'light'; // Default fallback
  }
}

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Must use physical device for push')
    return
  }
  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing
  if (existing !== 'granted') {
  try {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
    console.log('New status:', finalStatus)
  } catch (error) {
    console.error('Failed to get push token.', error);
    return
  }
  }
  if (finalStatus !== 'granted') {
    console.log('Push permission denied')
    return
  }
  try {
  const { data: token } = await Notifications.getExpoPushTokenAsync()
  await supabase
    .from('device_tokens')
    .upsert({ token : token}, { onConflict: ['token'] })
    console.log("Token inserted", token);
  }
  catch (error) {
    console.error('Failed to get push token', error);
    return
  }
}

export async function androidMicPermission() {
  if (Platform.OS === 'android') {
    const ok = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Mikrofon İzni',
        message: 'Konuşmanızı metne dönüştürebilmek için mikrofon izni gerekiyor.'
      }
    );
    return ok === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}