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
        <View style={styles.cellInner}>
          {children}
          {active && <View pointerEvents="none" style={styles.activeOverlay} />}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.topTitle}>부위 선택</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.header}>
        <Text style={styles.h1}>어디가 불편하신가요?</Text>
        <Text style={styles.h2}>불편한 부위를 모델에서 선택해주세요.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.gridRow}>
          <Cell area="FULL_ETC" style={styles.leftCell}>
            <Image source={img.FULL_ETC} style={styles.leftImg} resizeMode="contain" />
          </Cell>

          <View pointerEvents="none" style={styles.centerGap}>
            <View style={styles.centerLine} />
          </View>

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

          <View pointerEvents="none" style={styles.labelLayer}>
            <Text style={[styles.label, styles.labelLeftMid]}>전신 / 기타</Text>
            <Text style={[styles.label, styles.labelRight1]}>머리 / 얼굴</Text>
            <Text style={[styles.label, styles.labelRight2]}>목 / 가슴</Text>
            <Text style={[styles.label, styles.labelRight3]}>복부 / 골반</Text>
            <Text style={[styles.label, styles.labelRight4]}>팔 / 다리</Text>
          </View>
        </View>
      </View>

      <View style={styles.helperWrap}>
        <Text style={styles.helperText}>
          선택한 부위를 바탕으로 다음 단계에서 증상을 더 자세히 확인해요.
        </Text>
      </View>

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

const LINE = '#D9E7FB';
const BLUE = '#3B82F6';
const BLUE_DARK = '#2563EB';
const SELECT_BG = '#EEF5FF';
const SELECT_OVERLAY = 'rgba(59,130,246,0.08)';
const CARD_BG = '#FFFFFF';
const PAGE_BG = '#F6FAFF';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },

  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backTxt: {
    fontSize: 30,
    color: '#111827',
    fontWeight: '500',
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.2,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  h1: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontWeight: '500',
  },

  card: {
    flex: 1,
    marginHorizontal: 18,
    borderRadius: 22,
    backgroundColor: CARD_BG,
    borderWidth: 4,
    borderColor: '#E8EEF8',
    overflow: 'hidden',
    shadowColor: '#7AA8F7',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },

  cellBase: {
    borderColor: LINE,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cellPressed: {
    opacity: 0.96,
  },
  cellActive: {
    backgroundColor: SELECT_BG,
    // borderColor: BLUE, // 제거: 선택 시 파란 라인이 뜨는 것 방지
    // borderWidth: 1.5,
  },

  cellInner: {
    flex: 1,
  },
  activeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SELECT_OVERLAY,
  },

  leftCell: {
    flex: 1,
    borderRightWidth: 0,
  },

  rightCol: {
    flex: 1,
    flexDirection: 'column',
  },
  rightCell: {
    borderLeftWidth: 0,
  },

  leftImg: {
    width: '122%',
    height: '100%',
    transform: [{ translateX: -20 }, { translateY: 8 }],
  },

  imgHead: {
    width: '120%',
    height: '90%',
    transform: [{ translateX: -13 }, { translateY: 8 }],
  },
  imgNeck: {
    width: '123%',
    height: '98%',
    transform: [{ translateX: -10 }, { translateY: 0 }],
  },
  imgPelvis: {
    width: '116%',
    height: '100%',
    transform: [{ translateX: -3 }, { translateY: 0 }],
  },
  imgArmLeg: {
    width: '116%',
    height: '100%',
    transform: [{ translateX: -3 }, { translateY: 0 }],
  },

  centerGap: {
    width: 12,
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

  labelLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  label: {
    position: 'absolute',
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    backgroundColor: 'rgba(255,255,255,0.72)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  labelLeftMid: {
    left: 14,
    top: 14,
  },
  labelRight1: {
    right: 14,
    top: 12,
    textAlign: 'right',
  },
  labelRight2: {
    right: 14,
    top: '16%',
    textAlign: 'right',
  },
  labelRight3: {
    right: 14,
    top: '31%',
    textAlign: 'right',
  },
  labelRight4: {
    right: 14,
    bottom: 182,
    textAlign: 'right',
  },

  helperWrap: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 4,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },

  bottomArea: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
  },
  doneBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: BLUE_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOpacity: 0.22,
    shadowRadius: 12,
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
    letterSpacing: -0.2,
  },
  doneTxtDisabled: {
    color: '#9CA3AF',
  },
});