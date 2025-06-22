import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { updateFontSize, getFontSize } from '../utils/anonUserSupabase';
import { useTheme } from '../hooks/useTheme';

const fontSizes = [
  { label: 'Küçük', size: 16 },
  { label: 'Normal', size: 20 },
  { label: 'Büyük', size: 24 },
  { label: 'Çok Büyük', size: 28 },
];

export default function FontSettingsScreen() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(18);
  const { colors } = useTheme();

  useEffect(() => {
    loadSavedFontSize();
  }, []);

  const loadSavedFontSize = async () => {
    try {
      const savedSize = await getFontSize();
      setSelectedSize(savedSize);
    } catch (error) {
      console.error('Error loading saved font size:', error);
    }
  };

  const handleFontSizeChange = async (size: number) => {
    try {
      const result = await updateFontSize(size);
      if (result === 0) {
        setSelectedSize(size);
      } else {
        console.error('Font size update failed');
      }
    } catch (error) {
      console.error('Error updating font size:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.push('/ayarlar')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.primaryText }]}>Yazı Tipi ve Boyutu</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Okuma deneyiminizi iyileştirmek için yazı boyutunu ayarlayın.</Text>
        
        <View style={styles.optionsContainer}>
          {fontSizes.map((font) => (
            <TouchableOpacity
              key={font.size}
              style={[
                styles.option,
                { backgroundColor: colors.surface },
                selectedSize === font.size && { backgroundColor: colors.secondary + '20' },
              ]}
              onPress={() => handleFontSizeChange(font.size)}
            >
              <Text style={[
                styles.optionText,
                { fontSize: font.size, color: colors.primaryText },
                selectedSize === font.size && { color: colors.primary, fontWeight: 'bold' }
              ]}>
                {font.label}
              </Text>
              {selectedSize === font.size && (
                <MaterialIcons name="check" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.previewContainer}>
          <Text style={[styles.previewTitle, { color: colors.primaryText }]}>Önizleme</Text>
          <View style={[styles.previewBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.previewText, { fontSize: selectedSize, color: colors.primaryText }]}>
              Mümin Suresi, Allah'ın yaratıcılığını, kudretini ve insanın hayat ve ölüm üzerindeki tasarrufunu anlatır.
            </Text>
          </View>
        </View>
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
    marginBottom: 32,
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
  optionText: {
    color: '#333',
  },
  selectedText: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 8,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111',
  },
  previewBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  previewText: {
    color: '#333',
    lineHeight: 28,
  },
}); 