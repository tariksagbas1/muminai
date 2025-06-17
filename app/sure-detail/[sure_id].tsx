import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MuminAIDropdown from '../components/MuminAIDropdown';

export default function SureDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const sure_name = params.sure_name || '';
  const sure_number = params.sure_number || '';
  const sure_total_ayet = params.sure_total_ayet || '';
  const sure_era = params.sure_era || '';
  const sure_arabic = params.sure_arabic || '';
  const sure_meal = params.sure_meal || '';
  const sure_tefsir = params.sure_tefsir || '';
  const sure_tefsir_author = params.sure_tefsir_author || '';
  const sure_index = params.sure_index;
  const sureIndexText = sure_index ? ` (${sure_index})` : '';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        
      </View>
      <View style={styles.dropdownWrapper}>
       <MuminAIDropdown
        headerText="Mümin AI"
        prompt={"Sûre hakkında aklına takılan bir şey mi var? \n Mümin AI'a sorabilirsin."}
        bubble="Selamün Aleyküm. Bugünün sûreleri hakkında suâl etmek istediğin bir husus var mı?"
        inputPlaceholder="Sorunuzu yazınız..."
        onBack={() => router.back()}
        onShare={() => {}}
      >
        </MuminAIDropdown>
      </View>
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 18 }}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{sure_name} Suresi{sureIndexText}</Text>
          </View>
          <Text style={styles.sureInfo}>
            <Text style={{ fontWeight: 'bold' }}>Sure Numarası:</Text> {sure_number} | <Text style={{ fontWeight: 'bold' }}>Toplam Ayet:</Text> {sure_total_ayet} | <Text style={{ fontWeight: 'bold' }}>Dönem:</Text> {sure_era}
          </Text>
          {/* Arapça Metin */}
          <Text style={styles.sectionTitle}>Arapça Metin</Text>
          <View style={styles.sectionBox}>
            <Text style={styles.arabicText}>{sure_arabic}</Text>
          </View>
          {/* Türkçe Meal */}
          <Text style={styles.sectionTitle}>Türkçe Meal</Text>
          <View style={styles.sectionBox}>
            <Text style={styles.mealText}>{sure_meal}</Text>
          </View>
          {/* Tefsir */}
          <Text style={styles.sectionTitle}>Tefsir ({sure_tefsir_author})</Text>
          <View style={styles.sectionBox}>
            <Text style={styles.tefsirText}>{sure_tefsir}</Text>
          </View>
        </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: '#f3fbf6',
  },
  dropdownWrapper: {
    marginTop: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: -12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    flex: 1,
    marginTop:0,
    textAlign: 'center',
  },
  sureInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 18,
    marginBottom: 8,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  arabicText: {
    fontSize: 22,
    color: '#111',
    textAlign: 'right',
    lineHeight: 38,
  },
  mealText: {
    fontSize: 18,
    color: '#222',
    lineHeight: 28,
  },
  tefsirText: {
    fontSize: 17,
    color: '#228b22',
    lineHeight: 26,
  },
}); 