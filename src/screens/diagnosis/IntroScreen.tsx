// src/screens/diagnosis/IntroScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

export default function IntroScreen({ navigation }: Props) {
  const onNext = () => {
    navigation.navigate('BodySelect'); // ✅ 여기 고정
  };

  const onBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 뒤로가기 */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.backIcon}>{'‹'}</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>안녕하세요 저는 MediQ 입니다.</Text>
          <Text style={styles.desc}>
            어디가 아프신지 저에게 알려주시면{'\n'}
            제가 당신의 증상을 분석해드릴게요!
          </Text>

          <Image
            source={require('../../assets/image/mediq_character.png')}
            style={styles.character}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.nextText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EAF3FF',
  },

  backBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 34,
    lineHeight: 34,
    color: '#111',
    marginTop: -2,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },

  // ✅ 전체를 더 아래로
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 150, // 🔥 기존 120 -> 더 아래로
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },

  // ✅ 캐릭터 더 크게
  character: {
    width: 320,   // 🔥 260 -> 320
    height: 320,  // 🔥 260 -> 320
    marginTop: 4,
  },

  nextBtn: {
    height: 54,
    borderRadius: 10,
    backgroundColor: '#2F6FED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});