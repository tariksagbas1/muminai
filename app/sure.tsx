import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MuminAIDropdown from './components/MuminAIDropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase';

export default function SureScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // fallback if no params
  const title = params.title || 'Mülk (1-5)';
  const author = params.author || 'Elmalılı Hamdi Yazır';
  const content = params.content || `Mülk Suresi, Allah'ın yaratıcılığını, kudretini ve insanın hayat ve ölüm üzerindeki tasarrufunu anlatır...`;
  const arabic = params.arabic || '';
  const tefsir = params.tefsir || '';


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        
      </View>
      {/* Mümin AI Dropdown */}
      <MuminAIDropdown
        headerText=" Mümin AI "
        prompt={"Sure hakkında aklına takılan bir şey mi var?\nMümin AI'a sorabilirsin."}
        bubble="Bu sure hakkında merak ettiğiniz bir şey var mı? Sorularınızı sorabilirsiniz!"
        inputPlaceholder="Sorunuzu yazın..."
        onBack={() => router.back()}
        onShare={() => {}}
      />
      {/* Main Content */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={{padding: 20}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.source}><Text style={{fontWeight:'bold'}}>Tefsir Kaynağı:</Text> {author}</Text>
        <View style={styles.divider} />
        {arabic ? (
          <>
            <Text style={styles.sectionTitle}>Arapça Metin</Text>
            <View style={styles.sectionBox}>
              <Text style={styles.arabicText}>{arabic}</Text>
            </View>
          </>
        ) : null}
        <Text style={styles.sectionTitle}>Türkçe Meal</Text>
        <View style={styles.sectionBox}>
          <Text style={styles.mainText}>{content}</Text>
        </View>
        {tefsir ? (
          <>
            <Text style={styles.sectionTitle}>Tefsir</Text>
            <View style={styles.sectionBox}>
              <Text style={styles.tefsirText}>{tefsir}</Text>
            </View>
          </>
        ) : null}
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