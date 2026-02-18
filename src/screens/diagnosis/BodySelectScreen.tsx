// src/screens/diagnosis/BodySelectScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  Image,
  Text,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Area = 'FULL_ETC' | 'HEAD_FACE' | 'NECK_CHEST' | 'PELVIS_WAIST' | 'ARM_LEG';
type Props = NativeStackScreenProps<RootStackParamList, 'BodySelect'>;

export default function BodySelectScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<Area | null>(null);

  const img = useMemo(
    () => ({
      FULL_ETC: require('../../assets/image/body/body_full_etc.png'),
      HEAD_FACE: require('../../assets/image/body/body_head_face.png'),
      NECK_CHEST: require('../../assets/image/body/body_neck_chest.png'),
      PELVIS_WAIST: require('../../assets/image/body/body_pelvis_waist.png'),
      ARM_LEG: require('../../assets/image/body/body_arm_leg.png'),
    }),
    []
  );

  const onDone = () => {
    if (!selected) return;
    navigation.navigate('DetailCategory', { area: selected });
  };

  const Cell = ({
    area,
    children,
    style,
  }: {
    area: Area;
    children: React.ReactNode;
    style?: any;
  }) => {
    const active = selected === area;
    return (
      <Pressable
        onPress={() => setSelected(area)}
        style={({ pressed }) => [
          styles.cellBase,
          style,
          active && styles.cellActive,
          pressed && styles.cellPressed,
        ]}
      >
        {/* ✅ “전체가 눌린 느낌” 강제: 선택 오버레이 */}
        <View style={styles.cellInner}>
          {children}
          {active && <View pointerEvents="none" style={styles.activeOverlay} />}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단바 */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.topTitle}>부위선택</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 안내 */}
      <View style={styles.header}>
        <Text style={styles.h1}>어디가 불편하신가요?</Text>
        <Text style={styles.h2}>불편한 부위를 모델에서 선택해주세요.</Text>
      </View>

      {/* 카드 */}
      <View style={styles.card}>
        <View style={styles.gridRow}>
          {/* 왼쪽(전신/기타 합본) */}
          <Cell area="FULL_ETC" style={styles.leftCell}>
            <Image source={img.FULL_ETC} style={styles.leftImg} resizeMode="contain" />
          </Cell>

          {/* 가운데 간격 */}
          <View pointerEvents="none" style={styles.centerGap}>
            <View style={styles.centerLine} />
          </View>

          {/* 오른쪽 1,1,1.8,3.2 */}
          <View style={styles.rightCol}>
            <Cell area="HEAD_FACE" style={[styles.rightCell, { flex: 1 }]}>
              <Image source={img.HEAD_FACE} style={styles.imgHead} resizeMode="contain" />
            </Cell>

            <Cell area="NECK_CHEST" style={[styles.rightCell, { flex: 1 }]}>
              <Image source={img.NECK_CHEST} style={styles.imgNeck} resizeMode="contain" />
            </Cell>

            <Cell area="PELVIS_WAIST" style={[styles.rightCell, { flex: 1.7 }]}>
              <Image source={img.PELVIS_WAIST} style={styles.imgPelvis} resizeMode="contain" />
            </Cell>

            <Cell area="ARM_LEG" style={[styles.rightCell, { flex: 3.3 }]}>
              <Image source={img.ARM_LEG} style={styles.imgArmLeg} resizeMode="contain" />
            </Cell>
          </View>

          {/* 라벨(터치 방해 X) */}
          <View pointerEvents="none" style={styles.labelLayer}>
            <Text style={[styles.label, styles.labelLeftMid]}>전신/기타</Text>
            <Text style={[styles.label, styles.labelRight1]}>머리/얼굴</Text>
            <Text style={[styles.label, styles.labelRight2]}>목/가슴</Text>
            <Text style={[styles.label, styles.labelRight3]}>복부/골반</Text>
            <Text style={[styles.label, styles.labelRight4]}>팔/다리</Text>
          </View>
        </View>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomArea}>
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

const LINE = '#D7E6FF';
const BLUE = '#3B82F6';
const SELECT_BG = '#EAF3FF';
const SELECT_OVERLAY = 'rgba(59,130,246,0.10)';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F8FF' },

  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  backBtn: { width: 40 },
  backTxt: { fontSize: 28, color: '#111827' },
  topTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },

  header: { paddingHorizontal: 18, paddingBottom: 10 },
  h1: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 6 },
  h2: { fontSize: 13, color: '#6B7280' },

  card: {
    flex: 1,
    marginHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEF8',
    overflow: 'hidden',
  },
  gridRow: { flex: 1, flexDirection: 'row' },

  // ✅ 공통 셀
  cellBase: {
    borderColor: LINE,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cellPressed: { opacity: 0.97 },

  // ✅ 선택 시 “전체 셀”이 눌린 느낌: 배경 + 살짝 강조
  cellActive: {
    backgroundColor: SELECT_BG,
  },

  // ✅ 셀 내부 래핑(오버레이 올리려고)
  cellInner: {
    flex: 1,
  },
  activeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SELECT_OVERLAY, // ✅ 선택 필름
  },

  // 왼쪽 / 오른쪽 가운데선 이중선 방지
  leftCell: {
    flex: 1,
    borderRightWidth: 0,
  },
  rightCol: { flex: 1, flexDirection: 'column' },
  rightCell: {
    borderLeftWidth: 0,
  },

  // ✅ 왼쪽 전신/기타 “더 크게”
  leftImg: {
    width: '120%',          // 🔥 더 크게
    height: '100%',
    transform: [{ translateX: -35 }, { translateY: 6 }],
  },

  // ✅ 오른쪽은 영역별로 여백이 다르니 각각 최적화
  imgHead: {
    width: '120%',
    height: '90%',
    transform: [{ translateX: 0 }, { translateY: 8 }],
  },
  imgNeck: {
    width: '123%',
    height: '98%',
    transform: [{ translateX: 1 }, { translateY: -0 }],
  },
  imgPelvis: {
    width: '115%',
    height: '100%',
    transform: [{ translateX: 2 }, { translateY: -0 }],
  },
  imgArmLeg: {
    width: '115%',
    height: '100%',
    transform: [{ translateX: 3 }, { translateY: -0 }],
  },

  // 가운데 간격 + 라인
  centerGap: {
    width: 10,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  centerLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    marginLeft: -0.5,
    backgroundColor: LINE,
  },

  // 라벨
  labelLayer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  label: {
    position: 'absolute',
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  labelLeftMid: { left: 18, top: '2%' },
  labelRight1: { right: 18, top: 14, textAlign: 'right' },
  labelRight2: { right: 18, top: '16%', textAlign: 'right' },
  labelRight3: { right: 18, top: '31%', textAlign: 'right' },
  labelRight4: { right: 18, bottom: 200, textAlign: 'right' },

  bottomArea: { padding: 18 },
  doneBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnDisabled: { backgroundColor: '#E5E7EB' },
  doneTxt: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  doneTxtDisabled: { color: '#9CA3AF' },
});