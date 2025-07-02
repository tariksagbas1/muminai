import { MaterialIcons } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { androidMicPermission, getTone } from '../../utils/anonUserSupabase';

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eGtnYWxwaWJidW1hbHlsbW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODY2MzUsImV4cCI6MjA2NTU2MjYzNX0.VVg1x3-m1bsuU2RpJgnGqUqACZ7FVdisdctjobGQ680"

// User-specific conversation cache
const userConversationCache: { [userId: string]: Array<{ from: 'user' | 'ai'; text: string }> } = {};

// Function to get or create user cache
const getUserCache = (userId: string) => {
  if (!userConversationCache[userId]) {
    userConversationCache[userId] = [];
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
  const [currentAIResponse, setCurrentAIResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  
  // Load cached messages when component mounts
  useEffect(() => {
    setMessages(getCachedMessages(userId));
  }, [userId]);

  // useEffect for the typewriter animation
  useEffect(() => {
    if (isTyping && currentAIResponse) {
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < currentAIResponse.length) {
          const char = currentAIResponse.charAt(index); // Use charAt for safety
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            
            // Proper immutable update
            newMessages[newMessages.length - 1] = {
              ...lastMessage,
              text: lastMessage.text + char,
            };
            
            return newMessages;
          });
          index++;
        } else {
          clearInterval(intervalId);
          setIsTyping(false);
          setLoading(false);
          // Now that typing is complete, add the final message to the cache
          addToUserCache(userId, { from: 'ai', text: currentAIResponse });
          setCurrentAIResponse('');
        }
      }, 3); // Typing speed in milliseconds

      return () => clearInterval(intervalId);
    }
  }, [isTyping, currentAIResponse, userId]);

  const generateResponse = async (userInput: string) => {
    try {
      let systemPrompt = `You are an Islamic Q&A assistant named Mümin.
      You are a wise knowledgable Muslim fully committed to and supporting to Islam.
      You are not to talk about anything that is Haram.
      Always be respectful and formal.
      Quote the Kuran when necessary in your answer.
      Keep it short and concise.
      Do not use more than 350 words.
      This is a system prompt, do not use this information in your response.
      `;
      getTone().then(tone => {
        if (tone === 'heavy') {
          systemPrompt += `Always answer in Old Turkish.`;
          userInput = "Ey Mümin, " + userInput;
        }
        if (tone === 'light') {
          systemPrompt += `Always answer in Modern Turkish. Minimize arabic words.`;
        }

      });
      // Build conversation history from the last few messages
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      const response = await fetch('https://ewxkgalpibbumalylmma.supabase.co/functions/v1/openai-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          systemPrompt,
          conversationHistory,
          userInput: userInput,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.usage.total_tokens);
      return data.choices[0]?.message?.content || 'Üzgünüm, bir cevap oluşturulamadı.';
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error('Yanıt alınırken bir hata oluştu.');
    }
  };

  const handleSend = async (text?: string) => {
    const textToSend = (text || input).trim();
    if (!textToSend || isTyping) return;
    
    const userMessage = { from: 'user' as const, text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    addToUserCache(userId, userMessage);
    setInput('');
    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await generateResponse(textToSend);
      setMessages((prev) => [...prev, { from: 'ai' as const, text: '' }]);
      setCurrentAIResponse(response.trim());
      setIsTyping(true);
    } catch (error) {
      Alert.alert(
        'Hata',
        'Yanıt alınırken bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {messages.filter(m => m.from === 'user').length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 60 }}>
          <View style={styles.avatarCircleBg}>
            <Image
              source={require('../../assets/images/Untitled design.png')}
              style={[styles.bigAvatar, { shadowColor: colors.shadow }]}
            />
          </View>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={[styles.title, { color: colors.primaryText }]}>Mümin AI</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText, marginTop: 6 }]}>Mümine sor.</Text>
            <Text style={{ color: colors.tertiaryText, marginTop: 10, fontSize: 16, maxWidth: 280, textAlign: 'center' }}>
             Sen sorularını yaz, Mümin cevaplasın.
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.header, { backgroundColor: colors.background, justifyContent: 'center', marginTop: 60, flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 16}]}> 
          <Text style={[styles.title, { color: colors.primaryText, alignSelf: 'flex-start' }]}>Mümin AI</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText, marginTop: 0, alignSelf: 'flex-start' }]}>Mümine sor.</Text>
        </View>
      )}
      
      <ScrollView style={[styles.messages, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: 16, marginTop: 0 }}>
        {messages.map((msg, idx) => (
          msg.from === 'user' ? (
            <View key={idx} style={[
              styles.messageBubble, 
              styles.userMsg, 
              { backgroundColor: colors.primary }
            ]}>
              <Text style={{ 
                color: colors.background 
              }}>
                {msg.text}
              </Text>
            </View>
          ) : (
            <View key={idx} style={styles.aiMessageContainer}>
              <Image 
                source={require('../../assets/images/mumin-avatar_bg_removed.png')}
                style={styles.aiAvatar}
              />
              <View style={[
                styles.messageBubble,
                styles.aiMsg,
                { backgroundColor: colors.surface }
              ]}>
                <Text style={{ 
                  color: colors.primaryText 
                }}>
                  {msg.text}
                </Text>
              </View>
            </View>
          )
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
          onChangeText={(text) => {
            if (text.endsWith('\n')) {
              // Send the text without the newline character
              handleSend(text.slice(0, -1));
            } else {
              setInput(text);
            }
          }}
          multiline={true}
          editable={!loading}
          returnKeyType="send"
        />
        <TouchableOpacity 
          style={[styles.sendBtn, loading && styles.sendBtnDisabled, { backgroundColor: colors.primary }]} 
          onPress={() => handleSend()}
          disabled={loading}
        >
          <MaterialIcons name="send" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.micBtn, { backgroundColor: colors.primary, marginLeft: 6 }]}
          onPress={async () => {
            if (Platform.OS === 'android') {
              const ok = await androidMicPermission();
              if (!ok) {
                console.log('Microphone permission rejected');
                return;
              }
            }
            else if (Platform.OS === 'ios') {
              try {
                await Voice.start('tr-TR');
                console.log('Voice recognition started');
              } catch (e) {
                console.error('Voice start error', e);
              }
            }
          }}
          disabled={loading}
        >
          <MaterialIcons name="mic" size={18} color="#fff" />
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
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '100%',
  },
  userMsg: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginBottom: 8,
  },
  aiAvatar: {
    width: 42,
    height: 42,
    borderRadius: 20,
    marginLeft: 10,
    marginBottom: -5,
    zIndex: 1,
  },
  aiMsg: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    marginLeft: 0,
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
  micBtn: {
    borderRadius: 10,
    padding: 10,
  },
  sendBtnDisabled: {
    backgroundColor: 'rgb(72, 72, 72)',
    color: 'rgb(100, 100, 100)',
  },
  bigAvatar: {
    width: 165,
    height: 165,
    borderRadius: 55,
    borderWidth: 0,
    marginBottom: -5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0, //0.18
    shadowRadius: 12,
    elevation: 4,
  },
  avatarCircleBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderColor: 'rgb(255, 253, 249)',
    borderWidth: 0,
    backgroundColor: 'transparent', //rgb(242, 246, 249)
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },
});
