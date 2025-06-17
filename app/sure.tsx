import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MuminAIDropdown from './components/MuminAIDropdown';

export default function SureScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // fallback if no params
  const title = params.title || 'Mülk (1-5)';
  const source = params.source || 'Elmalılı Hamdi Yazır';
  const author = params.author || 'Elmalılı Hamdi Yazır';
  const content = params.content || `Mülk Suresi, Allah'ın yaratıcılığını, kudretini ve insanın hayat ve ölüm üzerindeki tasarrufunu anlatır. İlk beş ayet, Allah'ın her şeye kadir olduğunu ve insanın bu dünyadaki imtihanının önemini vurgular. Ayetler: 1. Mülk elinde olan Allah yücedir. O, her şeye kadirdir. 2. Hanginizin daha güzel amel işleyeceğini sınamak için ölümü ve hayatı yarattı. 3. Yedi göğü tabaka tabaka yarattı. Rahman'ın yaratmasında bir düzensizlik göremezsin. 4. Gözünü çevir bak, bir bozukluk görebiliyor musun? 5. Andolsun, biz en yakın göğü kandillerle donattık...`;

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
        <Text style={styles.source}><Text style={{fontWeight:'bold'}}>Kaynak:</Text> {source} | <Text style={{fontWeight:'bold'}}>Yazar:</Text> {author}</Text>
        <View style={styles.divider} />
        <Text style={styles.mainText}>{content}</Text>
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
}); 