import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';

export default function AyarlarScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const settings = [
    {
      icon: 'format-align-left' as const,
      iconBg: colors.icon_bg,
      iconColor: colors.primary,
      title: 'Yazı Tipi ve Boyutu',
      subtitle: 'Okuma metnini özelleştirin',
      onPress: () => router.push('/font_settings'),
    },
    {
      icon: 'nightlight-round' as const,
      iconBg: colors.icon_bg,
      iconColor: colors.primary,
      title: 'Görünüm',
      subtitle: 'Açık veya Koyu Mod',
      onPress: () => router.push('/display_settings'),
    },
    {
      icon: 'notifications-none' as const,
      iconBg: colors.icon_bg,
      iconColor: colors.primary,
      title: 'Bildirimler',
      subtitle: 'Günün Suresi ve hatırlatmalar',
      onPress: () => router.push('/notification_settings'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryText }]}>Ayarlar</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Uygulama deneyiminizi kişiselleştirin.</Text>
      <View style={{ height: 16 }} />
      {settings.map((item, idx) => (
        <TouchableOpacity
          key={item.title}
          style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
          activeOpacity={0.7}
          onPress={item.onPress}
        >
          <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}> 
            <MaterialIcons name={item.icon} size={28} color={item.iconColor} />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardTitle, { color: colors.primaryText }]}>{item.title}</Text>
            <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>{item.subtitle}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={28} color={colors.tertiaryText} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginLeft: 24,
    marginBottom: 2,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 22,
    marginLeft: 24,
    marginBottom: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 18,
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
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 17,
  },
}); 