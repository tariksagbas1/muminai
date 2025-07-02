import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { getTone, updateTone } from '../utils/anonUserSupabase';

const STYLES = [
  {
    key: 'light',
    label: 'Modern Türkçe',
    description: 'Günlük, sade ve çağdaş bir dil kullanılır.',
    icon: <MaterialIcons name="chat-bubble-outline" size={28} />,
  },
  {
    key: 'heavy',
    label: 'Geleneksel Türkçe',
    description: 'Daha klasik, geleneksel ve edebi bir dil kullanılır.',
    icon: <FontAwesome5 name="book" size={26} />,
  }
];

export default function ToneSettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedStyle, setSelectedStyle] = useState('light');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTone();
  }, []);

  const loadTone = async () => {
    setLoading(true);
    try {
      const tone = await getTone();
      if (tone === 'light' || tone === 'heavy') {
        setSelectedStyle(tone);
      } else {
        setSelectedStyle('light');
      }
    } catch (e) {
      setSelectedStyle('light');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (key: string) => {
    if (selectedStyle === key) return;
    setSaving(true);
    const result = await updateTone(key);
    if (result === 0) {
      setSelectedStyle(key);
    }
    setSaving(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}> 
          <MaterialIcons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primaryText }]}>Mümin'in Türkçesi</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.secondaryText }]}>Mümin'in cevaplarında kullanılacak Türkçe üslubu seçin.</Text>
        <View style={{ height: 24 }} />
        {loading ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : (
          <View style={{ gap: 18 }}>
            {STYLES.map(style => {
              const isSelected = selectedStyle === style.key;
              return (
                <TouchableOpacity
                  key={style.key}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                      shadowColor: colors.shadow,
                      opacity: saving ? 0.6 : 1,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleSelect(style.key)}
                  disabled={saving}
                >
                  <View style={[styles.iconBox, { backgroundColor: isSelected ? colors.primary : colors.icon_bg }]}> 
                    {React.cloneElement(style.icon, { color: isSelected ? '#fff' : colors.primary })}
                  </View>
                  <View style={styles.cardTextBox}>
                    <Text style={[styles.cardTitle, { color: colors.primaryText }]}>{style.label}</Text>
                    <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>{style.description}</Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                      <MaterialIcons name="check" size={22} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
    padding: 24,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 18,
    padding: 20,
    marginBottom: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 80,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#666',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
});
