import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, AppState, AppStateStatus } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { updateNotifications, getNotifications } from '../utils/anonUserSupabase';
import { useTheme } from '../hooks/useTheme';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    loadNotificationStatus();
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, []);

  const handleAppStateChange = (state: AppStateStatus) => {
    if (state === 'active') {
      loadNotificationStatus();
    }
  };

  const loadNotificationStatus = async () => {
    setLoading(true);
    try {
      const enabled = await getNotifications();
      setNotificationEnabled(!!enabled);
    } catch (error) {
      console.error('Error loading notification status:', error);
      setNotificationEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (value: boolean) => {
    // Optimistically do not update UI until backend confirms
    try {
      const result = await updateNotifications(value);
      if (result === 0) {
        setNotificationEnabled(value);
      } else {
        // Optionally, show a message to the user
        if (value) {
          Alert.alert(
            'Bildirimleri Etkinleştirin',
            'Lütfen bildirim izinlerini cihaz ayarlarından açın.'
          );
        }
        // Do not update the UI
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.push('/ayarlar')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primaryText }]}>Bildirimler</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Günlük hatırlatmaları özelleştirin.
        </Text>

        {/* Single Switch */}
        <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.primaryText }]}>Günlük Bildirimler</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>Günlük okumalarınız güncellenince bildirim alın</Text>
            </View>
            <Switch
              value={notificationEnabled}
              onValueChange={handleNotificationChange}
              trackColor={{ false: colors.disabled, true: colors.success }}
              ios_backgroundColor={colors.disabled}
              disabled={loading}
            />
          </View>
        </View>

        <Text style={[styles.note, { color: colors.secondaryText }]}>
          Not: Bildirimlere ilk kez izin verirken Ayarlardan bildirimleri açmanız gerekebilir.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 70,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#111',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  note: {
    fontSize: 17,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
});
