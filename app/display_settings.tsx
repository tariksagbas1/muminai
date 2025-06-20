import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { updateTheme, getTheme } from '../utils/anonUserSupabase';
import { useTheme } from '../hooks/useTheme';

const themes = [
  {
    label: 'Açık Tema',
    value: 'light' as const,
    icon: 'light-mode' as const,
    description: 'Beyaz arka plan, koyu metin',
  },
  {
    label: 'Koyu Tema',
    value: 'dark' as const,
    icon: 'dark-mode' as const,
    description: 'Koyu arka plan, açık metin',
  },
  {
    label: 'Gri Tema',
    value: 'grey' as const,
    icon: 'tonality' as const,
    description: 'Gri arka plan, dengeli kontrast',
  },
];

export default function DisplaySettingsScreen() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'grey'>('light');
  const { colors, updateThemeState } = useTheme();

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await getTheme();
      setSelectedTheme(savedTheme as 'light' | 'dark' | 'grey');
    } catch (error) {
      console.error('Error loading saved theme:', error);
    }
  };

  const handleThemeChange = async (theme: 'light' | 'dark' | 'grey') => {
    try {
      const result = await updateTheme(theme);
      if (result === 0) {
        setSelectedTheme(theme);
        updateThemeState(theme);
      } else {
        console.error('Theme update failed');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.push('/ayarlar')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primaryText }]}>Görünüm</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Gözleriniz için en rahat tema seçeneğini belirleyin.</Text>
        
        <View style={styles.optionsContainer}>
          {themes.map((theme) => (
            <TouchableOpacity
              key={theme.value}
              style={[
                styles.option,
                { backgroundColor: colors.surface },
                selectedTheme === theme.value && { backgroundColor: colors.theme_bg },
              ]}
              onPress={() => handleThemeChange(theme.value)}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionIconContainer, { backgroundColor: colors.background }]}>
                  <MaterialIcons 
                    name={theme.icon} 
                    size={24} 
                    color={selectedTheme === theme.value ? colors.primary : colors.secondaryText} 
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionTitle,
                    { color: colors.primaryText },
                    selectedTheme === theme.value && { color: colors.primary, fontWeight: 'bold' }
                  ]}>
                    {theme.label}
                  </Text>
                  <Text style={[styles.optionDescription, { color: colors.secondaryText }]}>{theme.description}</Text>
                </View>
              </View>
              {selectedTheme === theme.value && (
                <MaterialIcons name="check" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.note, { color: colors.secondaryText }]}>
          Not: Tema değişikliği uygulamanın yeniden başlatılmasını gerektirebilir.
        </Text>
      </ScrollView>
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
  optionsContainer: {
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#e7fbe9',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#22c55e',
  },
  note: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
}); 