import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const settings = [
  {
    icon: 'format-align-left' as const,
    iconBg: '#e7fbe9',
    iconColor: '#22c55e',
    title: 'Yazı Tipi ve Boyutu',
    subtitle: 'Okuma metnini özelleştirin',
    onPress: () => {},
  },
  {
    icon: 'nightlight-round' as const,
    iconBg: '#e7fbe9',
    iconColor: '#22c55e',
    title: 'Görünüm',
    subtitle: 'Açık veya Koyu Mod',
    onPress: () => {},
  },
  {
    icon: 'notifications-none' as const,
    iconBg: '#e7fbe9',
    iconColor: '#22c55e',
    title: 'Bildirimler',
    subtitle: 'Günün Suresi ve hatırlatmalar',
    onPress: () => {},
  },
];

export default function AyarlarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>
      <Text style={styles.subtitle}>Uygulama deneyiminizi kişiselleştirin.</Text>
      <View style={{ height: 16 }} />
      {settings.map((item, idx) => (
        <TouchableOpacity
          key={item.title}
          style={styles.card}
          activeOpacity={0.7}
          onPress={item.onPress}
        >
          <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}> 
            <MaterialIcons name={item.icon} size={28} color={item.iconColor} />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={28} color="#bbb" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111',
    marginLeft: 24,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 22,
    color: '#6b7280',
    marginLeft: 24,
    marginBottom: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  cardTextBox: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 17,
    color: '#6b7280',
  },
}); 