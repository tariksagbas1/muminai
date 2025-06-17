import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MuminAIDropdown from './components/MuminAIDropdown';

export default function HikayeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // fallback if no params
  const title = params.title || 'Hüsnü Zan ve İyi Düşünmenin Önemi';
  const source = params.source || "İmam Gazali, İhyâ-u Ulûmi'd-Dîn";
  const author = params.author || 'İmam Gazali';
  const content = params.content || `Bir gün, bir grup insan bir araya gelerek birbirleri hakkında konuşmaya başladılar. İçlerinden biri, diğerlerinin kötü niyetli olduğunu ve her zaman olumsuz düşündüklerini söyledi. Ancak, bu sırada yaşlı bir bilge aralarına katıldı. Bilge, onlara şöyle dedi: 'Ey gençler! İnsanlar hakkında duyduğunuz her şeyde, mevcut iyi niyetleri görebilmeyi öğrenin. Eğer birinin kalbinde kötü bir niyet ararsanız, onu bulursunuz; ama eğer iyi bir niyet peşindeyseniz, o da sizi bulur.' Bu sözler üzerine grup, birbirlerine karşı olan önyargılarını sorgulamaya başladılar. Her biri, diğerlerini daha iyi anlamaya ve iyi düşünmeye gayret etti.`;

  return (
    

    <View style={styles.container}>
      <View style={styles.header}>
        
        </View>
      <View style={styles.dropdownWrapper}>
      <MuminAIDropdown
        headerText="Mümin AI"
        prompt={"Metinde aklına takılan bir şey mi var?\nMümin AI'a sorabilirsin."}
        bubble="Selamün Aleyküm. Bu hikayede suâl etmek istediğiniz bir husus var mı?"
        inputPlaceholder="Sorunuzu yazınız..."
        onBack={() => router.back()}
        onShare={() => {}}
      />
      </View>
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
  header: {
    height: 50,
    backgroundColor: '#f3fbf6',
  },
  dropdownWrapper: {
    marginTop: 0,
  },
  container: { flex: 1, backgroundColor: '#fff' },
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