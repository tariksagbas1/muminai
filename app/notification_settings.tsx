import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [sureBildirim, setSureBildirim] = useState(false);
  const [okumaBildirim, setOkumaBildirim] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/ayarlar')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirimler</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Günlük hatırlatmaları özelleştirin.
        </Text>

        {/* Switches */}
        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Günün Sureleri</Text>
              <Text style={styles.settingDescription}>Her gün yeni 3 sure için bildirim alın</Text>
            </View>
            <Switch
              value={sureBildirim}
              onValueChange={setSureBildirim}
              trackColor={{ false: '#e5e5ea', true: '#34c759' }}
              ios_backgroundColor="#e5e5ea"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Günün Okumaları</Text>
              <Text style={styles.settingDescription}>Günün okumaları için hatırlatma alın</Text>
            </View>
            <Switch
              value={okumaBildirim}
              onValueChange={setOkumaBildirim}
              trackColor={{ false: '#e5e5ea', true: '#34c759' }}
              ios_backgroundColor="#e5e5ea"
            />
          </View>
        </View>

        <Text style={styles.note}>
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
