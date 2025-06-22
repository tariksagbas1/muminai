import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Dimensions, Alert, ScrollView, BackHandler, Keyboard } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import SparkleIcon from './SparkleIcon';
import { useTheme } from '../../hooks/useTheme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DROPDOWN_MAX_HEIGHT = SCREEN_HEIGHT * 0.4;

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;


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
  const [currentAIResponse, setCurrentAIResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: open ? DROPDOWN_MAX_HEIGHT : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    
    if (!open) {
      Keyboard.dismiss();
    }
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
          setCurrentAIResponse('');
        }
      }, 5); // Matching user's preferred speed

      return () => clearInterval(intervalId);
    }
  }, [isTyping, currentAIResponse]);

  const generateResponse = async (userInput: string) => {
    try {
      let systemPrompt = `You are an Islamic Q&A assistant named Mümin, for Turkish Seniors.
      You are a wise knowledgable Muslim fully committed to and supporting to Islam.
      You are not to talk about anything that is Haram.
      Always be respectful and formal.
      Always quote the given source or the Kuran when you answer.
      `;
      
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
          model: 'gpt-4.1',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userInput }
          ],
          temperature: 0.7,
          max_tokens: 300
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

  const handleSend = async (text?: string) => {
    const textToSend = (text || input).trim();
    if (!textToSend || isTyping) return;
    
    const userMessage = { from: 'user' as const, text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
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
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      {/* Header Row */}
      <View style={[styles.headerRow, { backgroundColor: colors.background_accent }]}>
        <TouchableOpacity onPress={onBack} style={[styles.iconBtn, {width: 50, height: 50, marginLeft: 2, marginTop: 5}]}>
          <MaterialIcons name="arrow-back" size={35} color={colors.button_color} />
        </TouchableOpacity>
        <View style={styles.sparkleRow}>
          <SparkleIcon size={18} color={colors.accentText} style={{ marginRight: 6, marginTop: 1 }} />
          <Text style={[styles.headerText, {color: colors.accentText}]}>{headerText}</Text>
          <SparkleIcon size={18} color={colors.accentText} style={{ marginLeft: 6, marginTop: 1 }} />
        </View>
        <TouchableOpacity onPress={onShare} style={[styles.iconBtn, {marginRight: 2, marginTop: 5}]}>
          <Feather name="share-2" size={25} color={colors.button_color}/>
        </TouchableOpacity>
      </View>
      <Text style={[styles.prompt, { backgroundColor: colors.background_accent }]}>{prompt}</Text>
      {/* Arrow Button */}
      <View style={[styles.arrowRow, { backgroundColor: colors.background_accent }]} pointerEvents="box-none" >
        <TouchableOpacity onPress={() => setOpen((v) => !v)} style={{width: 120, height: 50, alignItems: 'center', justifyContent: 'center', overflow: ''}}>
          <MaterialIcons name={open ? 'expand-less' : 'expand-more'} size={18} color={colors.button_color2} style={styles.arrowBtn} />
        </TouchableOpacity>
      </View>
      {/* Dropdown wrapper adds margin only when open */}
      <View style={{ marginTop: open ? 23 : 0, alignItems: 'center' }}>
        <Animated.View
          style={[
            styles.dropdownCard,
            {
              height: animatedHeight,
              opacity: animatedHeight.interpolate({ inputRange: [0, 40], outputRange: [0, 1], extrapolate: 'clamp' }),
              marginBottom: open ? -20 : -10,
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
                  onScrollBeginDrag={Keyboard.dismiss}
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
            <View style={[styles.inputBar, { 
              borderTopColor: 'transparent', 
              backgroundColor: colors.background,
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
                placeholder={inputPlaceholder}
                placeholderTextColor={colors.tertiaryText}
                value={input}
                onChangeText={(text) => {
                  if (text.endsWith('\n')) {
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
                <MaterialIcons name="send" size={18} color={colors.background} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.micBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <MaterialIcons name="mic" size={18} color={colors.primary} />
              </TouchableOpacity>
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
    width: 40,
    height: 40,
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
    backgroundColor: '#eee',
    borderRadius: 20,
    width: 40,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 10,
    borderColor: '#eee',
    marginTop: 10,
    textAlign: 'center',
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
    marginTop: 10,
    
  },
  messagesContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  message: {
    padding: 12,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 12,
    marginBottom: 10,
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
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    width: '100%',
    marginBottom: -7,
    marginTop: -10,
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
    borderRadius: 20,
    padding: 10,
    marginRight: 4,
  },
  sendBtnDisabled: {
    backgroundColor: 'rgb(72, 72, 72)',
    color: 'rgb(100, 100, 100)',
  },
  micBtn: {
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
  },
}); 