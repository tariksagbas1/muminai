import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MuminAIDropdown from './components/MuminAIDropdown';
import { useFontSize } from '../hooks/useFontSize';
import { useTheme } from '../hooks/useTheme';

export default function HikayeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { fontSize } = useFontSize();
  const { colors } = useTheme();

  // fallback if no params
  const title = (params.title as string) || 'Hüsnü Zan ve İyi Düşünmenin Önemi';
  const source = (params.source as string) || "İmam Gazali, İhyâ-u Ulûmi'd-Dîn";
  const author = (params.author as string) || 'İmam Gazali';
  const content = (params.content as string) || `Bir gün, bir grup insan bir araya gelerek birbirleri hakkında konuşmaya başladılar. İçlerinden biri, diğerlerinin kötü niyetli olduğunu ve her zaman olumsuz düşündüklerini söyledi. Ancak, bu sırada yaşlı bir bilge aralarına katıldı. Bilge, onlara şöyle dedi: 'Ey gençler! İnsanlar hakkında duyduğunuz her şeyde, mevcut iyi niyetleri görebilmeyi öğrenin. Eğer birinin kalbinde kötü bir niyet ararsanız, onu bulursunuz; ama eğer iyi bir niyet peşindeyseniz, o da sizi bulur.' Bu sözler üzerine grup, birbirlerine karşı olan önyargılarını sorgulamaya başladılar. Her biri, diğerlerini daha iyi anlamaya ve iyi düşünmeye gayret etti.`;

  return (
    

    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        
        </View>
      <View style={styles.dropdownWrapper}>
      <MuminAIDropdown
        headerText="Mümin AI"
        prompt={"Metinde aklına takılan bir şey mi var?\nMümin AI'a sorabilirsin."}
        bubble="Selamün Aleyküm. Bu hikayede suâl etmek istediğiniz bir husus var mı?"
        inputPlaceholder="Sorunuzu yazınız..."
        onBack={() => router.back()}
        onShare={() => {}}
        contextData={{
          story_title: title as string,
          story_source: source as string,
          story: content as string
        }}
      />
      </View>
      {/* Main Content */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={{padding: 20}}>
        <Text style={[styles.title, { color: colors.primaryText }]}>{title}</Text>
        <Text style={[styles.source, { color: colors.tertiaryText }]}><Text style={{fontWeight:'bold'}}>Kaynak:</Text> {source} | <Text style={{fontWeight:'bold'}}>Yazar:</Text> {author}</Text>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <Text style={[styles.mainText, { fontSize: fontSize, color: colors.storyText }]}>{content}</Text>
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