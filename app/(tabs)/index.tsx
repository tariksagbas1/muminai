import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, Button, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getOrCreateAnonUserId } from '../../utils/anonUserSupabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../hooks/useTheme';

async function loadUserSuras(user_id: number) {
  const PROJECT_REF = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_REF || process.env.SUPABASE_PROJECT_REF;
  const ANON_KEY = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY) as string;
  const res = await fetch(
    `https://${PROJECT_REF}.functions.supabase.co/return-sures`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
      } as Record<string, string>,
      body: JSON.stringify({ user_id }),
    }
  );
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
}
async function loadUserDailyContent(user_id: number) {
  const PROJECT_REF = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_REF || process.env.SUPABASE_PROJECT_REF;
  const ANON_KEY = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY) as string;
  const res = await fetch(
    `https://${PROJECT_REF}.functions.supabase.co/return-daily-content`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
      } as Record<string, string>,
      body: JSON.stringify({ user_id }),
    }
  );
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
}

export default function OkuScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [user_id, setUserId] = useState<number | null>(null);

  const [sures, setSures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dailyContent, setDailyContent] = useState<any>(null);
  const [dailyLoading, setDailyLoading] = useState<boolean>(false);
  const [dailyError, setDailyError] = useState<string | null>(null);

  const clearUser = async () => {
    await AsyncStorage.removeItem('anonUserId');
    console.log('User ID cleared');
  };

  //Load user_id
  useEffect(() => {
    (async () => {
      const id = await getOrCreateAnonUserId();
      setUserId(Number(id));
    })();
  }, []);

  // Load sures
  useEffect(() => {
    if (!user_id) return;
    const fetchSures = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadUserSuras(user_id);
        setSures(data);
      } catch (e: any) {
        setError(e.message || 'Bağlantı hatası');
      } finally {
        setLoading(false);
      }
    };
    fetchSures();
  }, [user_id]);
  // Load daily content
  useEffect(() => {
    const fetchDailyContent = async () => {
      if (!user_id) return;
      setDailyLoading(true);
      setDailyError(null);
      try {
        const data = await loadUserDailyContent(user_id);
        setDailyContent(data);
      } catch (err: any) {
        setDailyError(err.message || 'Bağlantı hatası');
      } finally {
        setDailyLoading(false);
      }
    };
    fetchDailyContent();
  }, [user_id]);

  // Dynamic HIKAYE based on dailyContent
  const HIKAYE = {
    title: dailyContent?.story_title || 'Yükleniyor...',
    source: dailyContent?.story_source || 'Yükleniyor...',
    author: dailyContent?.story_author || 'Yükleniyor...',
    content: dailyContent?.story || 'Yükleniyor...',
  };

  // Dynamic HADIS based on dailyContent
  const HADIS = {
    title: dailyContent?.hadis_title || 'Yükleniyor...',
    source: dailyContent?.hadis_source || 'Yükleniyor...',
    content: dailyContent?.hadis_meal || 'Yükleniyor...',
  };
  const FACT = {
    title: dailyContent?.fun_fact_title || 'Yükleniyor...',
    content: dailyContent?.fun_fact || 'Yükleniyor...',
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View>
          <Text style={[styles.title, { color: colors.primaryText }]}>Mümin AI</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Bugünün okumalarını yaptın mı?</Text>
           <Button title="Clear User ID" onPress={clearUser} />
        </View>
        <Image 
          source={require('../../assets/images/mumin-avatar_bg_removed.png')}
          style={styles.avatar}
        />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>Bugünün Okumaları</Text>
      {/* Günün Hikayesi Card */}
      <TouchableOpacity style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]} onPress={() => router.push({ pathname: '/hikaye', params: HIKAYE })}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="menu-book" size={28} color={colors.primary} />
          <Text style={[styles.cardHeaderText, { color: colors.primaryText }]}>Günün Hikayesi</Text>
        </View>
        <Text style={[styles.cardTitle, { color: colors.primaryText }]}>{HIKAYE.title}</Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
        {HIKAYE.content.substring(0, 100)}...
        </Text>
        <Text style={[styles.cardSource, { color: colors.tertiaryText }]}><Text style={{fontWeight:'bold'}}>Kaynak:</Text> {HIKAYE.source}</Text>
        <Text style={[styles.cardLink, { color: colors.accentText }]}>Devamını okumak için tıklayın...</Text>
      </TouchableOpacity>
      {/* Günün Hadisi Card */}
      <TouchableOpacity style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]} onPress={() => router.push({ pathname: '/hadis', params: HADIS })}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="auto-awesome" size={28} color={colors.primary} />
          <Text style={[styles.cardHeaderText, { color: colors.primaryText }]}>Günün Hadis-i-Şerifi</Text>
        </View>
        <Text style={[styles.cardTitle, { color: colors.primaryText }]}>{HADIS.title}</Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
          {HADIS.content.substring(0, 50)}...
        </Text>
        <Text style={[styles.cardSource, { color: colors.tertiaryText }]}><Text style={{fontWeight:'bold'}}>Kaynak Kitabı:</Text> {HADIS.source}</Text>
        <Text style={[styles.cardLink, { color: colors.accentText }]}>Tamamını okumak için tıklayın...</Text>
      </TouchableOpacity>
      {/* Günün Bilgisi Card */}
      <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="emoji-objects" size={28} color={colors.primary} />
          <Text style={[styles.cardHeaderText, { color: colors.primaryText }]}>Günün Bilgisi</Text>
        </View>
        <Text style={[styles.cardTitle, { color: colors.primaryText }]}>{FACT.title}</Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
          {FACT.content}
        </Text>
      </View>
      {/* Günün Sureleri Section */}
      <Text style={[styles.sureSectionTitle, { color: colors.primaryText }]}>Günün Sureleri</Text>
      {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />}
      {error && <Text style={{ color: 'red', margin: 16 }}>{error}</Text>}
      {!loading && !error && sures.map((sure) => {
        const sureIndexText = sure.sure_index ? ` (${sure.sure_index})` : '';
        return (
          <TouchableOpacity
            key={sure.sure_id}
            style={[styles.sureCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: `/sure-detail/${sure.sure_id}` as any, params: { ...sure, sure_id: undefined } })}
          >
            <View>
              <Text style={[styles.sureCardTitle, { color: colors.primaryText }]}>{sure.sure_name} Suresi{sureIndexText}</Text>
              <Text style={[styles.sureCardSubtitle, { color: colors.secondaryText }]}>
                <Text style={{ fontWeight: 'bold' }}>Toplam Ayet:</Text> {sure.sure_total_ayet} | <Text style={{ fontWeight: 'bold' }}>Dönem:</Text> {sure.sure_era}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={28} color={colors.tertiaryText} style={{ position: 'absolute', right: 18, top: 28 }} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
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
    padding: 16,
    marginTop: 60,
    textAlign: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 20,
    color: '#6b7280',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
    marginLeft: 16,
    marginTop: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    marginHorizontal: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
  },
  cardContent: {
    fontSize: 16,
    color: '#6b7280',
  },
  cardSource: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },
  cardLink: {
    fontSize: 14,
    color: '#16a34a',
    marginTop: 6,
  },
  sureSectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
    marginLeft: 16,
    marginTop: 18,
  },
  sureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    marginHorizontal: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  sureCardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
  },
  sureCardSubtitle: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: '600',
  },
}); 