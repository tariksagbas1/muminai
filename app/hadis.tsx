import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MuminAIDropdown from './components/MuminAIDropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFontSize } from '../hooks/useFontSize';
import { useTheme } from '../hooks/useTheme';

export default function SureScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { fontSize } = useFontSize();
  const { colors } = useTheme();

  // fallback if no params
  const title = (params.title as string) || 'Müminlerin Kardeşliği';
  const content = (params.content as string) || `Mümin, müminin kardeşidir; ona zulmetmez, onu düşmana teslim etmez. Kim kardeşinin bir ihtiyacını giderirse Allah da onun ihtiyaçlarını giderir.`;
  const source = (params.source as string) || 'Sünen­-i Ebû Dâvûd';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        
      </View>
      {/* Mümin AI Dropdown */}
      <MuminAIDropdown
        headerText=" Mümin AI "
        prompt={"Sure hakkında aklına takılan bir şey mi var?\nMümin AI'a sorabilirsin."}
        bubble="Bu sure hakkında merak ettiğiniz bir şey var mı? Sorularınızı sorabilirsiniz!"
        inputPlaceholder="Sorunuzu yazın..."
        onBack={() => router.back()}
        onShare={() => {}}
        contextData={{
          hadis_meal: content as string,
          hadis_source: source as string,
        }}
      />
      {/* Main Content */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={{padding: 20}} onScrollBeginDrag={Keyboard.dismiss}>
        <Text style={[styles.title, { color: colors.primaryText }]}>{title}</Text>
        <Text style={[styles.source, { color: colors.tertiaryText }]}><Text style={{fontWeight:'bold'}}>Kitap Kaynağı:</Text> {source}</Text>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        
        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Türkçe Meal</Text>
        <View style={[styles.sectionBox, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.mainText, { fontSize: fontSize, color: colors.mealText }]}>{content}</Text>
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 12,
    paddingBottom: 0,
    backgroundColor: '#f6fef8',
    height: 50,
  },
  backBtn: { padding: 4 },
  contentScroll: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },
  source: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  mainText: {
    fontSize: 20,
    color: '#222',
    lineHeight: 30,
    marginBottom: 16,
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
  tefsirText: {
    fontSize: 17,
    color: '#228b22',
    lineHeight: 26,
  },
}); 