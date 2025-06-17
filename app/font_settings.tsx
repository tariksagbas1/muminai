import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const fontSizes = [
  { label: 'Küçük', size: 14 },
  { label: 'Normal', size: 18 },
  { label: 'Büyük', size: 22 },
  { label: 'Çok Büyük', size: 26 },
];

export default function FontSettingsScreen() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(16);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/ayarlar')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yazı Tipi ve Boyutu</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>Okuma deneyiminizi iyileştirmek için yazı boyutunu ayarlayın.</Text>
        
        <View style={styles.optionsContainer}>
          {fontSizes.map((font) => (
            <TouchableOpacity
              key={font.size}
              style={[
                styles.option,
                selectedSize === font.size && styles.selectedOption,
              ]}
              onPress={() => setSelectedSize(font.size)}
            >
              <Text style={[
                styles.optionText,
                { fontSize: font.size },
                selectedSize === font.size && styles.selectedText
              ]}>
                {font.label}
              </Text>
              {selectedSize === font.size && (
                <MaterialIcons name="check" size={24} color="#22c55e" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Önizleme</Text>
          <View style={styles.previewBox}>
            <Text style={[styles.previewText, { fontSize: selectedSize }]}>
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
    lineHeight: 24,
  },
}); 