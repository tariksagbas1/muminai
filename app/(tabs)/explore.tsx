import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SorScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Merhaba! Size nasıl yardımcı olabilirim?' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    // Simulate OpenAI API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'ai', text: 'Cevabım: Bu bir örnek yanıttır. (Kaynak: Diyanet İşleri Başkanlığı)' },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.messages} contentContainerStyle={{ padding: 16 }}>
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
