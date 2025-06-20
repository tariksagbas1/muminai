import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Dimensions, Alert, ScrollView, BackHandler } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import SparkleIcon from './SparkleIcon';
import { useTheme } from '../../hooks/useTheme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DROPDOWN_MAX_HEIGHT = SCREEN_HEIGHT * 0.3;

const OPENAI_API_KEY = '';


export default function MuminAIDropdown({
  headerText = 'Mümin AI',
  prompt = 'Sure hakkında aklına takılan bir şey mi var?\nMümin AI\'a sorabilirsin.',
  bubble = 'Bu sure hakkında merak ettiğiniz bir şey var mı? Sorularınızı sorabilirsiniz!',
  inputPlaceholder = 'Sorunuzu yazın...',
  onBack,
  onShare,
  children,
  contextData
}: {
  headerText?: string;
  prompt?: string;
  bubble?: string;
  inputPlaceholder?: string;
  onBack?: () => void;
  onShare?: () => void;
  children?: React.ReactNode;
  contextData?: {
    sure_title?: string;
    sure_meal?: string;
    sure_tefsir?: string;
    sure_tefsir_author?: string;
    story_title?: string;
    story_source?: string;
    story?: string;
    [key: string]: any;
  };
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false); // closed by default
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'ai'; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: open ? DROPDOWN_MAX_HEIGHT : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [open]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Auto-scroll when loading state changes
  useEffect(() => {
    if (loading && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [loading]);

  const generateResponse = async (userInput: string) => {
    try {
      let systemPrompt = "You are an Islamic Q&A assistant named Mümin, for Turkish Seniors. You should be acting as if you are a wise knowledgable person fully committed to Islam. You are a strong supporter of Islam. You are not to talk about anything that is Haram. Always be respectful and formal. Always answer in Turkish.";
      
      // Add context data to system prompt if available
      if (contextData) {
        let contextInfo = "";
        
        // For sure pages
        if (contextData.sure_title && contextData.sure_meal && contextData.sure_tefsir) {
          contextInfo += `\n\nBu konuşma ${contextData.sure_title} Suresi hakkındadır. `;
          contextInfo += `\n\nSurenin Türkçe meali:\n${contextData.sure_meal}`;
          contextInfo += `\n\nSurenin tefsiri:\n${contextData.sure_tefsir}, Tefsirin Yapan Kişi: ${contextData.sure_tefsir_author}`;
        }
        
        // For story pages
        if (contextData.story_title && contextData.story_source && contextData.story) {
          contextInfo += `\n\nBu konuşma "${contextData.story_title}" hakkındadır. `;
          contextInfo += `\n\nKaynak: ${contextData.story_source}`;
          contextInfo += `\n\nİçerik:\n${contextData.story}`;
        }
        
        if (contextInfo) {
          systemPrompt += contextInfo;
        }
      }
      
      // Build conversation history from the last few messages
      const conversationHistory = messages.slice(-3).map(msg => ({
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
    setInput('');
    setLoading(true);

    try {
      const response = await generateResponse(input);
      const aiMessage = { from: 'ai' as const, text: response };
      setMessages((prev) => [...prev, aiMessage]);
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
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      {/* Header Row */}
      <View style={[styles.headerRow, { backgroundColor: colors.background_accent }]}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.button_color} />
        </TouchableOpacity>
        <View style={styles.sparkleRow}>
          <SparkleIcon size={18} color={colors.accentText} style={{ marginRight: 6, marginTop: 1 }} />
          <Text style={[styles.headerText, {color: colors.accentText}]}>{headerText}</Text>
          <SparkleIcon size={18} color={colors.accentText} style={{ marginLeft: 6, marginTop: 1 }} />
        </View>
        <TouchableOpacity onPress={onShare} style={styles.iconBtn}>
          <Feather name="share-2" size={18} color={colors.button_color}/>
        </TouchableOpacity>
      </View>
      <Text style={[styles.prompt, { backgroundColor: colors.background_accent }]}>{prompt}</Text>
      {/* Arrow Button */}
      <View style={[styles.arrowRow, { backgroundColor: colors.background_accent }]} pointerEvents="box-none">
        <TouchableOpacity style={styles.arrowBtn} onPress={() => setOpen((v) => !v)}>
          <MaterialIcons name={open ? 'expand-less' : 'expand-more'} size={18} color={colors.button_color2} />
        </TouchableOpacity>
      </View>
      {/* Dropdown wrapper adds margin only when open */}
      <View style={{ marginTop: open ? 32 : 0, alignItems: 'center' }}>
        <Animated.View
          style={[
            styles.dropdownCard,
            {
              height: animatedHeight,
              opacity: animatedHeight.interpolate({ inputRange: [0, 40], outputRange: [0, 1], extrapolate: 'clamp' }),
              marginBottom: open ? 16 : 0,
              backgroundColor: colors.background_accent_2,
              marginTop: 10,
            },
          ]}
          pointerEvents={open ? 'auto' : 'none'}
        >
          <View style={{ flex: 1, width: '100%', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <View style={{ flex: 1 }}>
              {messages.length === 0 ? (
                <View style={styles.bubble}>
                  <Text style={styles.bubbleText}>{bubble}</Text>
                </View>
              ) : (
                <ScrollView 
                  ref={scrollViewRef}
                  style={styles.messagesContainer} 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.messagesContentContainer}
                >
                  {messages.map((msg, idx) => (
                    <View key={idx} style={[styles.message, msg.from === 'user' ? styles.userMsg : styles.aiMsg]}>
                      <Text style={[styles.messageText, msg.from === 'user' ? styles.userMsgText : styles.aiMsgText]}>
                        {msg.text}
                      </Text>
                    </View>
                  ))}
                  {loading && (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.loadingText}>Yanıtlanıyor...</Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
            <View style={styles.inputRowWrapper}>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { 
                    height: 'auto',
                    maxHeight: 120,
                    paddingTop: 8,
                    paddingBottom: 8,
                    minHeight: 40
                  }]}
                  placeholder={inputPlaceholder}
                  value={input}
                  onChangeText={setInput}
                  multiline={true}
                  editable={!loading}
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                />
                <TouchableOpacity 
                  style={[styles.sendBtn, loading && styles.sendBtnDisabled, { backgroundColor: colors.primary }]} 
                  onPress={handleSend}
                  disabled={loading}
                >
                  <MaterialIcons name="send" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.micBtn}>
                  <MaterialIcons name="mic" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
      {/* Children (rest of the page) always below dropdown */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingBottom: 0,
    marginBottom: 12,
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    zIndex: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 12,
    backgroundColor: '#f3fbf6',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    minHeight: 44,
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 120,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    marginTop: 0,
  },
  prompt: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 0,
    marginTop: 0,
    lineHeight: 20,
    width: '100%',
    paddingHorizontal: 0,
    zIndex: 100,
  },
  arrowRow: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: -50,
    zIndex: 3,
  },
  arrowBtn: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 10,
  },
  dropdownCard: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    paddingVertical: 18,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  bubble: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 0,
    alignSelf: 'stretch',
  },
  bubbleText: {
    color: '#222',
    fontSize: 16,
    textAlign: 'left',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messagesContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
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
  messageText: {
    fontSize: 14,
  },
  userMsgText: {
    color: '#fff',
  },
  aiMsgText: {
    color: '#222',
  },
  loadingContainer: {
    padding: 12,
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
  },
  inputRowWrapper: {
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    flexShrink: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
    marginBottom: 0,
    alignSelf: 'stretch',
    marginTop: 16,
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  sendBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 6,
    marginRight: 4,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#ccc',
  },
  micBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#eee',
    width: 28,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 