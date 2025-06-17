import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


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
  const [sures, setSures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dailyContent, setDailyContent] = useState<any>(null);
  const [dailyLoading, setDailyLoading] = useState<boolean>(false);
  const [dailyError, setDailyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSures = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await loadUserSuras(1);
        setSures(data);
      } catch (e: any) {
        setError(e.message || 'Bağlantı hatası');
      } finally {
        setLoading(false);
      }
    };
    fetchSures();
  }, []);

  useEffect(() => {
    const fetchDailyContent = async () => {
      setDailyLoading(true);
      setDailyError(null);
      try {
        const data = await loadUserDailyContent(1);
        setDailyContent(data);
      } catch (err: any) {
        setDailyError(err.message || 'Bağlantı hatası');
      } finally {
        setDailyLoading(false);
      }
    };
    fetchDailyContent();
  }, []);

  // Dynamic HIKAYE based on dailyContent
  const HIKAYE = {
    title: dailyContent?.story_title || 'Yükleniyor...',
    source: dailyContent?.story_source || 'Yükleniyor...',
    author: dailyContent?.story_author || 'Yükleniyor...',
    content: dailyContent?.story || 'Yükleniyor...',
  };

  // Dynamic SURE based on dailyContent
  const SURE = {
    title: dailyContent ? (dailyContent.sure_index ? `${dailyContent.sure_title} (${dailyContent.sure_index})` : dailyContent.sure_title) : 'Yükleniyor...',
    author: dailyContent?.sure_tefsir_author || 'Yükleniyor...',
    content: dailyContent?.sure_meal || 'Yükleniyor...',
    arabic: dailyContent?.sure_arabic || '',
    tefsir: dailyContent?.sure_tefsir || '',
  };
  const FACT = {
    title: dailyContent?.fun_fact_title || 'Yükleniyor...',
    content: dailyContent?.fun_fact || 'Yükleniyor...',
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mümin AI</Text>
          <Text style={styles.subtitle}>Bugünün okumalarını yaptın mı?</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Bugünün Okumaları</Text>
      {/* Günün Hikayesi Card */}
      <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/hikaye', params: HIKAYE })}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="menu-book" size={28} color="#16a34a" />
          <Text style={styles.cardHeaderText}>Günün Hikayesi</Text>
        </View>
        <Text style={styles.cardTitle}>{HIKAYE.title}</Text>
        <Text style={styles.cardContent}>
        {HIKAYE.content.substring(0, 100)}...
        </Text>
        <Text style={styles.cardSource}><Text style={{fontWeight:'bold'}}>Kaynak:</Text> {HIKAYE.source}</Text>
        <Text style={styles.cardLink}>Devamını okumak için tıklayın...</Text>
      </TouchableOpacity>
      {/* Günün Suresi Card */}
      <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/sure', params: SURE })}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="auto-awesome" size={28} color="#16a34a" />
          <Text style={styles.cardHeaderText}>Günün Suresi</Text>
        </View>
        <Text style={styles.cardTitle}>{SURE.title}</Text>
        <Text style={styles.cardContent}>
          {SURE.content.substring(0, 100)}...
        </Text>
        <Text style={styles.cardSource}><Text style={{fontWeight:'bold'}}>Tefsir Kaynağı:</Text> {SURE.author}</Text>
        <Text style={styles.cardLink}>Arapça metni ve tefsiri okumak için tıklayın...</Text>
      </TouchableOpacity>
      {/* Günün Bilgisi Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="emoji-objects" size={28} color="#16a34a" />
          <Text style={styles.cardHeaderText}>Günün Bilgisi</Text>
        </View>
        <Text style={styles.cardTitle}>{FACT.title}</Text>
        <Text style={styles.cardContent}>
          {FACT.content}
        </Text>
      </View>
      {/* Günün Sureleri Section */}
      <Text style={styles.sureSectionTitle}>Günün Sureleri</Text>
      {loading && <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 24 }} />}
      {error && <Text style={{ color: 'red', margin: 16 }}>{error}</Text>}
      {!loading && !error && sures.map((sure) => {
        const sureIndexText = sure.sure_index ? ` (${sure.sure_index})` : '';
        return (
          <TouchableOpacity
            key={sure.sure_id}
            style={styles.sureCard}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: `/sure-detail/${sure.sure_id}` as any, params: { ...sure, sure_id: undefined } })}
          >
            <View>
              <Text style={styles.sureCardTitle}>{sure.sure_name} Suresi{sureIndexText}</Text>
              <Text style={styles.sureCardSubtitle}>
                <Text style={{ fontWeight: 'bold' }}>Toplam Ayet:</Text> {sure.sure_total_ayet} | <Text style={{ fontWeight: 'bold' }}>Dönem:</Text> {sure.sure_era}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={28} color="#bbb" style={{ position: 'absolute', right: 18, top: 28 }} />
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
    justifyContent: 'flex-start',
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