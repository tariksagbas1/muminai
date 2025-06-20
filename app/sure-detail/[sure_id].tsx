import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import MuminAIDropdown from '../components/MuminAIDropdown';
import { useFontSize } from '../../hooks/useFontSize';
import { useTheme } from '../../hooks/useTheme';

export default function SureDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { fontSize } = useFontSize();
  const { colors } = useTheme();

  const sure_name = (params.sure_name as string) || '';
  const sure_number = (params.sure_number as string) || '';
  const sure_total_ayet = (params.sure_total_ayet as string) || '';
  const sure_era = (params.sure_era as string) || '';
  const sure_arabic = (params.sure_arabic as string) || '';
  const sure_meal = (params.sure_meal as string) || '';
  const sure_tefsir = (params.sure_tefsir as string) || '';
  const sure_tefsir_author = (params.sure_tefsir_author as string) || '';
  const sure_index = params.sure_index;
  const sureIndexText = sure_index ? ` (${sure_index})` : '';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        
      </View>
      <View style={styles.dropdownWrapper}>
       <MuminAIDropdown
        headerText="Mümin AI"
        prompt={"Sûre hakkında aklına takılan bir şey mi var? \n Mümin AI'a sorabilirsin."}
        bubble="Selamün Aleyküm. Bugünün sûreleri hakkında suâl etmek istediğin bir husus var mı?"
        inputPlaceholder="Sorunuzu yazınız..."
        onBack={() => router.back()}
        onShare={() => {}}
        contextData={{
          sure_title: sure_name,
          sure_meal: sure_meal,
          sure_tefsir: sure_tefsir
        }}
      >
        </MuminAIDropdown>
      </View>
        <ScrollView style={[styles.container, { backgroundColor: colors.surface }]} contentContainerStyle={{ padding: 18 }}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerTitle, { color: colors.primaryText }]}>{sure_name} Suresi{sureIndexText}</Text>
          </View>
          <Text style={[styles.sureInfo, { color: colors.tertiaryText }]}>
            <Text style={{ fontWeight: 'bold' }}>Sure Numarası:</Text> {sure_number} | <Text style={{ fontWeight: 'bold' }}>Toplam Ayet:</Text> {sure_total_ayet} | <Text style={{ fontWeight: 'bold' }}>Dönem:</Text> {sure_era}
          </Text>
          {/* Arapça Metin */}
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Arapça Metin</Text>
          <View style={[styles.sectionBox, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.arabicText, { fontSize: fontSize + 4, color: colors.arabicText }]}>{sure_arabic}</Text>
          </View>
          {/* Türkçe Meal */}
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Türkçe Meal</Text>
          <View style={[styles.sectionBox, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.mealText, { fontSize: fontSize, color: colors.mealText }]}>{sure_meal}</Text>
          </View>
          {/* Tefsir */}
          <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Tefsir ({sure_tefsir_author})</Text>
          <View style={[styles.sectionBox, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Text style={[styles.tefsirText, { fontSize: fontSize, color: colors.tefsirText }]}>{sure_tefsir}</Text>
            <Text style={[{ color: 'rgb(42, 42, 42)' , fontSize: 14, fontWeight: 'light', fontStyle: 'italic', opacity: 0.7, textAlign: 'right', marginRight: 10}]}>Kısaltılmış Özet</Text>
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