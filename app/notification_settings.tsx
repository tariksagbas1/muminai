import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { updateNotifications, getNotifications } from '../utils/anonUserSupabase';
import { useTheme } from '../hooks/useTheme';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [sureBildirim, setSureBildirim] = useState(false);
  const [okumaBildirim, setOkumaBildirim] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    loadSavedNotifications();
  }, []);

  const loadSavedNotifications = async () => {
    try {
      const notifications = await getNotifications();
      setSureBildirim(notifications.sureNotif);
      setOkumaBildirim(notifications.readingNotif);
    } catch (error) {
      console.error('Error loading saved notifications:', error);
    }
  };

  const handleSureBildirimChange = async (value: boolean) => {
    try {
      const result = await updateNotifications(value, okumaBildirim);
      if (result === 0) {
        setSureBildirim(value);
      } else {
        console.error('Sure notification update failed');
      }
    } catch (error) {
      console.error('Error updating sure notification:', error);
    }
  };

  const handleOkumaBildirimChange = async (value: boolean) => {
    try {
      const result = await updateNotifications(sureBildirim, value);
      if (result === 0) {
        setOkumaBildirim(value);
      } else {
        console.error('Reading notification update failed');
      }
    } catch (error) {
      console.error('Error updating reading notification:', error);
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

        {/* Switches */}
        <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.primaryText }]}>Günün Sureleri</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>Her gün yeni 3 sure için bildirim alın</Text>
            </View>
            <Switch
              value={sureBildirim}
              onValueChange={handleSureBildirimChange}
              trackColor={{ false: colors.disabled, true: colors.success }}
              ios_backgroundColor={colors.disabled}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: colors.primaryText }]}>Günün Okumaları</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>Günün okumaları için hatırlatma alın</Text>
            </View>
            <Switch
              value={okumaBildirim}
              onValueChange={handleOkumaBildirimChange}
              trackColor={{ false: colors.disabled, true: colors.success }}
              ios_backgroundColor={colors.disabled}
            />
          </View>
        </View>

        <Text style={[styles.note, { color: colors.secondaryText }]}>
          Not: Bildirimleri kapatmak için telefonunuzun ayarlarından da değişiklik yapmanız gerekebilir.
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
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
});
