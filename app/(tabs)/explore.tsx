import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';

const OPENAI_API_KEY = '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';

// Conversation cache to persist messages while app is running
let conversationCache: Array<{ from: 'user' | 'ai'; text: string }> = [
  { from: 'ai', text: 'Esselâmü aleyküm ve rahmetullâhi; ben Mümin, neyi arzu eyler, nasıl hizmet sunmamı dileresiniz?' }
];

// Function to add message to cache and maintain max 20 messages
const addToCache = (message: { from: 'user' | 'ai'; text: string }) => {
  conversationCache.push(message);
  // Keep only the last 20 messages
  if (conversationCache.length > 20) {
    conversationCache = conversationCache.slice(-20);
  }
};

// Function to get cached messages
const getCachedMessages = () => {
  return [...conversationCache];
};

export default function SorScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(getCachedMessages());
  const [loading, setLoading] = useState(false);

  // Load cached messages when component mounts
  useEffect(() => {
    setMessages(getCachedMessages());
  }, []);

  const generateResponse = async (userInput: string) => {
    try {
      const systemPrompt = "You are an Islamic Q&A assistant named Mümin, for Turkish Seniors. You should be acting as if you are wise knowledgable person fully committed to and supporting to Islam. You are a strong supporter of Islam. You are not to talk about anything that is Haram. Always be respectful and formal. Always answer in Turkish.";
      
      // Build conversation history from the last few messages
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userInput }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Üzgünüm, bir cevap oluşturulamadı.';
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error('Yanıt alınırken bir hata oluştu.');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { from: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    addToCache(userMessage); // Add to cache
    setInput('');
    setLoading(true);

    try {
      const response = await generateResponse(input);
      const aiMessage = { from: 'ai' as const, text: response };
      setMessages((prev) => [...prev, aiMessage]);
      addToCache(aiMessage); // Add to cache
    } catch (error) {
      Alert.alert(
        'Hata',
        'Yanıt alınırken bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mümin AI</Text>
          <Text style={styles.subtitle}>Mümine sor.</Text>
        </View>
      </View>
      
      <ScrollView style={styles.messages} contentContainerStyle={{ padding: 16, marginTop: 0 }}>
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.message, msg.from === 'user' ? styles.userMsg : styles.aiMsg]}>
            <Text style={{ color: msg.from === 'user' ? '#fff' : '#222' }}>{msg.text}</Text>
          </View>
        ))}
        {loading && <Text style={{ color: '#888', marginTop: 8 }}>Yanıtlanıyor...</Text>}
      </ScrollView>
      <View style={styles.inputBar}>
        <TextInput
          style={[styles.input, { 
            height: 'auto',
            maxHeight: 120,
            paddingTop: 8,
            paddingBottom: 8,
            minHeight: 40
          }]}
          placeholder="Sorunuzu yazın..."
          value={input}
          onChangeText={setInput}
          editable={!loading}
          multiline={true}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
          <MaterialIcons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  messages: {
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMsg: {
    backgroundColor: '#22c55e',
    alignSelf: 'flex-end',
  },
  aiMsg: {
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    padding: 10,
  },
});
