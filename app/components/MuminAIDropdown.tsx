import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Dimensions } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import SparkleIcon from './SparkleIcon';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DROPDOWN_MAX_HEIGHT = SCREEN_HEIGHT * 0.3;

export default function MuminAIDropdown({
  headerText = 'Mümin AI',
  prompt = 'Sure hakkında aklına takılan bir şey mi var?\nMümin AI\'a sorabilirsin.',
  bubble = 'Bu sure hakkında merak ettiğiniz bir şey var mı? Sorularınızı sorabilirsiniz!',
  inputPlaceholder = 'Sorunuzu yazın...',
  onBack,
  onShare,
  children
}: {
  headerText?: string;
  prompt?: string;
  bubble?: string;
  inputPlaceholder?: string;
  onBack?: () => void;
  onShare?: () => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false); // closed by default
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: open ? DROPDOWN_MAX_HEIGHT : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [open]);

  return (
    <View style={styles.wrapper}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <View style={styles.sparkleRow}>
          <SparkleIcon size={18} color="#16a34a" style={{ marginRight: 2, marginTop: 1 }} />
          <Text style={styles.headerText}>{headerText}</Text>
          <SparkleIcon size={18} color="#16a34a" style={{ marginLeft: 2, marginTop: 1 }} />
        </View>
        <TouchableOpacity onPress={onShare} style={styles.iconBtn}>
          <Feather name="share-2" size={18} color="#222" />
        </TouchableOpacity>
      </View>
      <Text style={styles.prompt}>{prompt}</Text>
      {/* Arrow Button */}
      <View style={styles.arrowRow} pointerEvents="box-none">
        <TouchableOpacity style={styles.arrowBtn} onPress={() => setOpen((v) => !v)}>
          <MaterialIcons name={open ? 'expand-less' : 'expand-more'} size={18} color="#222" />
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
            },
          ]}
          pointerEvents={open ? 'auto' : 'none'}
        >
          <View style={{ flex: 1, width: '100%', justifyContent: 'flex-start', flexDirection: 'column' }}>
            <View style={{ flex: 1 }}>
              <View style={styles.bubble}><Text style={styles.bubbleText}>{bubble}</Text></View>
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
                />
                <TouchableOpacity style={styles.sendBtn}>
                  <MaterialIcons name="send" size={18} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.micBtn}>
                  <MaterialIcons name="mic" size={18} color="#16a34a" />
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
    backgroundColor: '#f3fbf6',
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
    color: '#16a34a',
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