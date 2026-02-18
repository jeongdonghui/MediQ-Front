// src/screens/diagnosis/DetailLocationScreen.tsx
import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Pressable, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DetailLocation'>;

type LocItem = { key: string; title: string; desc?: string };

export default function DetailLocationScreen({ navigation, route }: Props) {
  const { area, category } = route.params;

  const [selected, setSelected] = useState<string | null>(null);

  const { headerTitle, headerDesc, items } = useMemo(() => {
    // 머리/얼굴
    if (area === 'HEAD_FACE' && category === 'HEAD') {
      return {
        headerTitle: '머리 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [{ key: '두부', title: '두부', desc: '정수리 / 뒷 머리 / 옆 머리 / 앞 머리 / 이마' }],
      };
    }
    if (area === 'HEAD_FACE' && category === 'FACE') {
      return {
        headerTitle: '얼굴 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '안면부', title: '안면부', desc: '미간 / 광대 / 볼 / 턱 / 턱관절' },
          { key: '안구', title: '안구', desc: '안구 / 눈 주변' },
          { key: '구강 및 인후', title: '구강 및 인후', desc: '치아 / 잇몸 / 입 안 / 혀 / 코' },
          { key: '귀', title: '귀', desc: '귀 내부 / 귀 외부' },
        ],
      };
    }

    // 목/가슴
    if (area === 'NECK_CHEST' && category === 'NECK') {
      return {
        headerTitle: '목 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 모두 선택해주세요.',
        items: [
          { key: '목 안', title: '목 안' },
          { key: '목 앞/옆 쪽', title: '목 앞/옆 쪽' },
          { key: '뒷 목', title: '뒷 목' },
        ],
      };
    }
    if (area === 'NECK_CHEST' && category === 'CHEST') {
      return {
        headerTitle: '가슴 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '가슴 중앙', title: '가슴 중앙' },
          { key: '좌우 흉부', title: '좌우 흉부' },
          { key: '유방', title: '유방' },
        ],
      };
    }
    if (area === 'NECK_CHEST' && category === 'EPIGASTRIC') {
      return {
        headerTitle: '명치 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [{ key: '명치 중심', title: '명치 중심' }],
      };
    }

    //복부 골반
    if (area === 'PELVIS_WAIST' && category === 'UPPER ABDOMEN') {
      return {
        headerTitle: '상복부 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '우상복부', title: '우상복부' },
          { key: '좌상복부', title: '좌상복부' },
          { key: '상복부 중앙', title: '상복부 중앙' },
        ]
      };
    }
    if (area === 'PELVIS_WAIST' && category === 'MIDDLE ABDOMEN') {
      return {
        headerTitle: '중복부 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '배꼽주변', title: '배꼽주변' },
          { key: '옆구리', title: '옆구리' },
        ]
      };
    }

    if (area === 'PELVIS_WAIST' && category === 'LOWER ABDOMEN') {
      return {
        headerTitle: '하복부 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '우하복부', title: '우하복부' },
          { key: '좌하복부', title: '좌하복부' },
          { key: '하복부 중앙', title: '하복부 중앙' },
        ]
      };
    }

    if (area === 'PELVIS_WAIST' && category === 'PELVIS_GROIN') {
      return {
        headerTitle: '골반 및 서혜부 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '골반뼈 부근', title: '골반뼈 부근' },
          { key: '사타구니', title: '사타구니' },
          { key: '생식기', title: '생식기' },
          { key: '항문', title: '항문' },
        ]
      };
    }

    //팔다리
    if (area === 'ARM_LEG' && category === 'ARM') {
      return {
        headerTitle: '팔 및 서혜부 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '어깨', title: '어깨' },
          { key: '심팔 및 팔꿈치', title: '심팔 및 팔꿈치' },
          { key: '아랫팔 및 손목', title: '아랫팔 및 손목' },
          { key: '손', title: '손' },
        ]
      };
    }

    if (area === 'ARM_LEG' && category === 'LEG') {
      return {
        headerTitle: '다리 및 서혜부 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '허벅지 및 고관절', title: '허벅지 및 고관절' },
          { key: '무릎', title: '무릎' },
          { key: '종아리 및 발목', title: '종아리 및 발목' },
          { key: '발', title: '발' },
        ]
      };
    }

    //전신기타

    if (area === 'FULL_ETC' && category === 'SKIN') {
      return {
        headerTitle: '피부 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '피부표현', title: '피부표현' , desc: '발진 / 가려움증 / 수포 / 건조함'},
          { key: '피부하층 및 부종', title: '피부하층 및 부종' , desc: '멍 / 부어오름 / 멍울(혹)'},
        ]
      };
    }

    if (area === 'FULL_ETC' && category === 'NERVOUS SYSTEM') {
      return {
        headerTitle: '신경 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '감각이상', title: '감각이상' , desc: '저림 / 감각저하 / 과민반응'},
          { key: '조절기능', title: '조절기능' , desc: '떨림 / 균형 장애 / 어지럼증'},
        ]
      };
    }

    if (area === 'FULL_ETC' && category === 'GENERAL SYMPTOMS') {
      return {
        headerTitle: '전신증상 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '통증 및 컨디션', title: '통증 및 컨디션' , desc: '근육통 / 오한 / 발열'},
          { key: '순환 및 대사', title: '순환 및 대사' , desc: '식은땀 / 갈증 / 면역'},
        ]
      };
    }

    if (area === 'FULL_ETC' && category === 'BACK') {
      return {
        headerTitle: '배면 (뒷부분) 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: '등', title: '등' },
          { key: '허리', title: '허리' },
          { key: '꼬리뼈', title: '꼬리뼈' },
        ]
      };
    }

    return { headerTitle: '상세 위치 확인', headerDesc: '', items: [] as LocItem[] };
  }, [area, category]);

  const onDone = () => {
    if (!selected) return;
    navigation.navigate('SymptomSelect', { area, category, location: selected });
  };

  const Card = ({ item }: { item: LocItem }) => {
    const active = selected === item.key;
    return (
      <Pressable
        onPress={() => setSelected(item.key)} // ✅ 단일 선택
        style={({ pressed }) => [
          styles.cardItem,
          active && styles.cardItemActive,
          pressed && { opacity: 0.97 },
        ]}
      >
        <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>{item.title}</Text>
        {!!item.desc && (
          <Text style={[styles.cardDesc, active && styles.cardDescActive]}>{item.desc}</Text>
        )}
      </Pressable>
    );
  };

  const canSubmit = !!selected;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.topTitle}>상세 위치 확인</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.header}>
        <Text style={styles.h1}>{headerTitle}</Text>
        {!!headerDesc && <Text style={styles.h2}>{headerDesc}</Text>}
      </View>

      <View style={styles.listWrap}>
        {items.map((it) => (
          <Card key={it.key} item={it} />
        ))}
      </View>

      {/* ✅ 선택 완료 버튼: 선택 전 회색(비활성), 선택 후 파랑(활성) */}
      <View style={styles.bottomArea}>
        <Pressable
          onPress={onDone}
          disabled={!canSubmit}
          style={[styles.doneBtn, canSubmit ? styles.doneBtnEnabled : styles.doneBtnDisabled]}
        >
          <Text style={[styles.doneTxt, canSubmit ? styles.doneTxtEnabled : styles.doneTxtDisabled]}>
            선택 완료
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const BLUE = '#3B82F6';
const BG = '#F3F8FF';
const CARD_BG = '#FFFFFF';
const SELECT_BG = '#DCEBFF';
const BORDER = '#E6EEF8';
const SHADOW = '#000000';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backTxt: { fontSize: 28, color: '#111827', lineHeight: 30 },
  topTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },

  header: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 10 },
  h1: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 4 },
  h2: { fontSize: 12, color: '#6B7280' },

  listWrap: { paddingHorizontal: 18, gap: 12, flex: 1 },

  cardItem: {
    backgroundColor: CARD_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SHADOW,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardItemActive: {
    backgroundColor: SELECT_BG,
    borderColor: BLUE,
    shadowOpacity: 0.12,
    elevation: 3,
  },
  cardTitle: { fontSize: 13, fontWeight: '800', color: BLUE, marginBottom: 6, textAlign: 'center' },
  cardTitleActive: { color: BLUE },
  cardDesc: { fontSize: 11, color: '#6B7280', textAlign: 'center' },
  cardDescActive: { color: '#4B5563' },

  bottomArea: { paddingHorizontal: 18, paddingBottom: 18, paddingTop: 10 },
  doneBtn: { height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  doneBtnEnabled: { backgroundColor: BLUE },
  doneBtnDisabled: { backgroundColor: '#E5E7EB' },

  doneTxt: { fontSize: 13, fontWeight: '800' },
  doneTxtEnabled: { color: '#FFFFFF' },
  doneTxtDisabled: { color: '#9CA3AF' },
});