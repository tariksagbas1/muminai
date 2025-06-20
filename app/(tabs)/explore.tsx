import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const OPENAI_API_KEY = '';

// User-specific conversation cache
const userConversationCache: { [userId: string]: Array<{ from: 'user' | 'ai'; text: string }> } = {};

// Function to get or create user cache
const getUserCache = (userId: string) => {
  if (!userConversationCache[userId]) {
    userConversationCache[userId] = [
      { from: 'ai', text: 'Esselâmü aleyküm ve rahmetullâhi; ben Mümin, neyi arzu eyler, nasıl hizmet sunmamı dileresiniz?' }
    ];
  }
  return userConversationCache[userId];
};

// Function to add message to user's cache and maintain max 20 messages
const addToUserCache = (userId: string, message: { from: 'user' | 'ai'; text: string }) => {
  const userCache = getUserCache(userId);
  userCache.push(message);
  // Keep only the last 20 messages
  if (userCache.length > 20) {
    userConversationCache[userId] = userCache.slice(-20);
  }
};

// Function to get cached messages for specific user
const getCachedMessages = (userId: string) => {
  return [...getUserCache(userId)];
};

// Function to clear user's cache (useful for logout or reset)
const clearUserCache = (userId: string) => {
  delete userConversationCache[userId];
};

export default function SorScreen() {
  // For demo purposes, using a fixed user ID. In a real app, this would come from authentication
  const userId = "1"; // Changed to string to fix TypeScript errors
  const { colors } = useTheme();
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(getCachedMessages(userId));
  const [loading, setLoading] = useState(false);

  // Load cached messages when component mounts
  useEffect(() => {
    setMessages(getCachedMessages(userId));
  }, [userId]);

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
            { role: 'user', content: 'Ya Mümin,' + userInput }
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
    addToUserCache(userId, userMessage); // Add to user-specific cache
    setInput('');
    setLoading(true);

    try {
      const response = await generateResponse(input);
      const aiMessage = { from: 'ai' as const, text: response };
      setMessages((prev) => [...prev, aiMessage]);
      addToUserCache(userId, aiMessage); // Add to user-specific cache
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
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <View>
          <Text style={[styles.title, { color: colors.primaryText }]}>Mümin AI</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Mümine sor.</Text>
        </View>
      </View>
      
      <ScrollView style={[styles.messages, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: 16, marginTop: 0 }}>
        {messages.map((msg, idx) => (
          <View key={idx} style={[
            styles.message, 
            msg.from === 'user' ? 
              [styles.userMsg, { backgroundColor: colors.primary }] : 
              [styles.aiMsg, { backgroundColor: colors.surface }]
          ]}>
            <Text style={{ 
              color: msg.from === 'user' ? colors.background : colors.primaryText 
            }}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && <Text style={[styles.loadingText, { color: colors.tertiaryText }]}>Yanıtlanıyor...</Text>}
      </ScrollView>
      <View style={[styles.inputBar, { 
        borderTopColor: colors.border, 
        backgroundColor: colors.background 
      }]}>
        <TextInput
          style={[styles.input, { 
            height: 'auto',
            maxHeight: 120,
            paddingTop: 8,
            paddingBottom: 8,
            minHeight: 40,
            backgroundColor: colors.surface,
            color: colors.primaryText,
          }]}
          placeholder="Sorunuzu yazın..."
          placeholderTextColor={colors.tertiaryText}
          value={input}
          onChangeText={setInput}
          editable={!loading}
          multiline={true}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity 
          style={[styles.sendBtn, { backgroundColor: colors.primary }]} 
          onPress={handleSend} 
          disabled={loading}
        >
          <MaterialIcons name="send" size={24} color={colors.background} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  subtitle: {
    fontSize: 20,
  },
  messages: {
    flex: 1,
  },
  message: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMsg: {
    alignSelf: 'flex-end',
  },
  aiMsg: {
    alignSelf: 'flex-start',
  },
  loadingText: {
    marginTop: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendBtn: {
    borderRadius: 10,
    padding: 10,
  },
});
