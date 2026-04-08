// src/screens/diagnosis/BodySelectScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Area = 'FULL_ETC' | 'HEAD_FACE' | 'NECK_CHEST' | 'PELVIS_WAIST' | 'ARM_LEG';
type Props = NativeStackScreenProps<RootStackParamList, 'BodySelect'>;

const BLUE = '#4C8DF6';
const BLUE_DARK = '#2F6FE4';
const BG = '#F4F8FF';
const CARD = '#FFFFFF';
const TEXT = '#1F2A44';
const SUB = '#7B8794';
const BORDER = '#E5ECF8';

const BODY_OPTIONS: {
  key: Area;
  title: string;
  desc: string;
  icon: any;
}[] = [
  {
    key: 'HEAD_FACE',
    title: '머리 / 얼굴',
    desc: '머리, 이마, 관자놀이, 얼굴 통증',
    icon: require('../../assets/image/body/icon_head_face.png'),
  },
  {
    key: 'NECK_CHEST',
    title: '목 / 가슴',
    desc: '목, 어깨, 가슴 부위 불편감',
    icon: require('../../assets/image/body/icon_neck_chest.png'),
  },
  {
    key: 'PELVIS_WAIST',
    title: '복부 / 골반',
    desc: '배, 허리, 골반 부위 증상',
    icon: require('../../assets/image/body/icon_abdomen_pelvis.png'),
  },
  {
    key: 'ARM_LEG',
    title: '팔 / 다리',
    desc: '팔, 손, 다리, 무릎, 발 관련 증상',
    icon: require('../../assets/image/body/icon_arm_leg.png'),
  },
  {
    key: 'FULL_ETC',
    title: '전신 / 기타',
    desc: '전신 증상 또는 특정하기 어려운 경우',
    icon: require('../../assets/image/body/icon_full_body.png'),
  },
];

export default function BodySelectScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<Area | null>(null);

  const onDone = () => {
    if (!selected) return;
    navigation.navigate('DetailCategory', { area: selected });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>{'‹'}</Text>
        </Pressable>

        <Text style={styles.topTitle}>부위선택</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.h1}>어디가 불편하신가요?</Text>
          <Text style={styles.h2}>해당되는 부위를 선택해주세요.</Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.bodyPreviewWrap}>
            <Image
              source={require('../../assets/image/body/body_main.png')}
              style={styles.bodyPreview}
              resizeMode="contain"
            />
          </View>

          <View style={styles.optionList}>
            {BODY_OPTIONS.map((item) => {
              const active = selected === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => setSelected(item.key)}
                  style={({ pressed }) => [
                    styles.optionCard,
                    active && styles.optionCardActive,
                    pressed && styles.optionCardPressed,
                  ]}
                >
                  <View style={[styles.iconBox, active && styles.iconBoxActive]}>
                    <Image
                      source={item.icon}
                      style={styles.optionIcon}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.optionTextWrap}>
                    <Text style={[styles.optionTitle, active && styles.optionTitleActive]}>
                      {item.title}
                    </Text>
                    <Text style={styles.optionDesc}>{item.desc}</Text>
                  </View>

                  <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                    {active && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomWrap}>
        <Pressable
          onPress={onDone}
          disabled={!selected}
          style={[styles.doneBtn, !selected && styles.doneBtnDisabled]}
        >
          <Text style={[styles.doneTxt, !selected && styles.doneTxtDisabled]}>
            선택 완료
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  topBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BG,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backTxt: {
    fontSize: 30,
    color: TEXT,
    fontWeight: '500',
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: TEXT,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 14,
  },
  h1: {
    fontSize: 24,
    fontWeight: '900',
    color: TEXT,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 14,
    color: SUB,
    fontWeight: '500',
  },

  mainCard: {
    marginHorizontal: 18,
    borderRadius: 28,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: '#E8EEF9',
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
    shadowColor: '#7EA8F3',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  bodyPreviewWrap: {
    height: 210,
    borderRadius: 20,
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#EEF3FB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 14,
  },
  bodyPreview: {
    width: 180,
    height: 180,
    opacity: 0.96,
  },

  optionList: {
    gap: 10,
  },

  optionCard: {
    minHeight: 78,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#B7C9E8',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  optionCardActive: {
    borderColor: BLUE,
    backgroundColor: '#F6FAFF',
  },
  optionCardPressed: {
    opacity: 0.97,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F4F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxActive: {
    backgroundColor: '#EAF2FF',
  },
  optionIcon: {
    width: 34,
    height: 34,
  },

  optionTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: TEXT,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  optionTitleActive: {
    color: BLUE_DARK,
  },
  optionDesc: {
    fontSize: 12,
    color: '#8A94A6',
    lineHeight: 17,
    fontWeight: '500',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C9D6EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: BLUE,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BLUE,
  },

  bottomWrap: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 8,
    backgroundColor: BG,
  },
  doneBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  doneBtnDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  doneTxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  doneTxtDisabled: {
    color: '#9CA3AF',
  },
});