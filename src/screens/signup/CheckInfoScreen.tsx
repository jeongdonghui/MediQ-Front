// src/screens/signup/CheckInfoScreen.tsx
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';

type Props = { navigation?: any; route?: any };

const TERMS_LIST = [
  'MediQ 이용약관 (필수)',
  '개인정보 수집 이용 동의 (필수)',
  '휴대폰 본인인증서비스 (필수)',
  '위치정보 이용약관 동의 (필수)',
  '마케팅 수신 동의 (필수)',
  '개인정보 광고활용 동의 (필수)',
];

export default function CheckInfoScreen({ navigation, route }: Props) {
  const params = route?.params ?? {};

  const id: string = params.id ?? '';
  const password: string = params.password ?? '';
  const name: string = params.name ?? '';
  const nickname: string = params.nickname ?? '';
  const phone: string = (params.phone ?? '').toString();
  const birthFront6: string = params.birthFront6 ?? '';
  const birthBack1: string = params.birthBack1 ?? '';

  const birthDisplay = birthFront6 ? `${birthFront6} - ●●●●●●` : '';

  // ✅ 뒤로: goBack 우선 / 스택이 꼬였을 때는 PhoneNumber로 복구
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.reset?.({
      index: 0,
      routes: [
        {
          name: 'PhoneNumber',
          params: {
            id,
            password,
            name,
            nickname,
            birthFront6,
            birthBack1,
          },
        },
      ],
    });
  };

  const [modalVisible, setModalVisible] = useState(false);
  const openLockRef = useRef(false);

  const [allAgree, setAllAgree] = useState(false);
  const [termChecks, setTermChecks] = useState<boolean[]>(
    Array(TERMS_LIST.length).fill(false),
  );

  const handleOpenTerms = () => {
    if (openLockRef.current) return;
    openLockRef.current = true;
    setModalVisible(true);
    setTimeout(() => (openLockRef.current = false), 350);
  };

  const handleCloseTerms = () => setModalVisible(false);

  const toggleAllAgree = () => {
    const next = !allAgree;
    setAllAgree(next);
    setTermChecks(Array(TERMS_LIST.length).fill(next));
  };

  const toggleSingleTerm = (index: number) => {
    const next = [...termChecks];
    next[index] = !next[index];
    setTermChecks(next);
    setAllAgree(next.every(v => v));
  };

  const isTermsNextDisabled = useMemo(
    () => !termChecks.every(v => v),
    [termChecks],
  );

  // ✅ 가입 플로우 종료: reset (중복 화면/뒤로 꼬임 방지)
  const handleTermsNext = () => {
    if (isTermsNextDisabled) return;
    setModalVisible(false);

    navigation?.reset?.({
      index: 0,
      routes: [
        {
          name: 'Splash',
          params: {
            id,
            password,
            name,
            nickname,
            phone,
            birthFront6,
          },
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>
          입력한 정보를{'\n'}확인해주세요
        </Text>

        <InfoItem label="휴대폰번호" value={phone} />
        <InfoItem label="생년월일" value={birthDisplay} />
        <InfoItem label="닉네임" value={nickname} />
        <InfoItem label="이름" value={name} />
        <InfoItem label="아이디" value={id} />
      </View>

      {!modalVisible && (
        <TouchableOpacity
          style={styles.nextBar}
          onPress={handleOpenTerms}
          activeOpacity={0.8}
        >
          <Text style={styles.nextBarText}>다음</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={handleCloseTerms}
      >
        <View style={styles.modalRoot}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            activeOpacity={1}
            onPress={handleCloseTerms}
          >
            <View />
          </TouchableOpacity>

          <View style={styles.sheetContainer}>
            <Text style={styles.sheetTitle}>약관동의</Text>

            <TouchableOpacity
              style={styles.allAgreeRow}
              activeOpacity={0.8}
              onPress={toggleAllAgree}
            >
              <View style={styles.allAgreeLeft}>
                <View
                  style={[
                    styles.allAgreeCheckBox,
                    allAgree && styles.allAgreeCheckBoxOn,
                  ]}
                >
                  {allAgree && (
                    <Text style={styles.allAgreeCheckIcon}>✓</Text>
                  )}
                </View>
                <Text style={styles.allAgreeText}>전체동의</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.sheetDivider} />

            {TERMS_LIST.map((label, idx) => {
              const checked = termChecks[idx];
              return (
                <TouchableOpacity
                  key={label}
                  style={styles.termRow}
                  activeOpacity={0.8}
                  onPress={() => toggleSingleTerm(idx)}
                >
                  <Text style={[styles.termBullet, checked && styles.termBulletOn]}>
                    ✓
                  </Text>
                  <Text style={styles.termText}>{label}</Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[
                styles.sheetNextButton,
                isTermsNextDisabled && styles.sheetNextButtonDisabled,
              ]}
              activeOpacity={isTermsNextDisabled ? 1 : 0.8}
              disabled={isTermsNextDisabled}
              onPress={handleTermsNext}
            >
              <Text style={styles.sheetNextButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 56,
  },
  backButton: { paddingVertical: 4, marginBottom: 8 },
  backText: { fontSize: 28, color: WHITE, fontWeight: '500' },

  content: { flex: 1, marginTop: 24 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: WHITE,
    lineHeight: 34,
    marginBottom: 40,
  },

  item: { marginBottom: 18 },
  label: { fontSize: 13, color: WHITE, opacity: 0.9, marginBottom: 6 },
  value: { fontSize: 16, color: WHITE, paddingVertical: 4 },
  underline: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  nextBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBarText: { fontSize: 16, fontWeight: '600', color: BLUE },

  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  sheetContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
  },

  sheetTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },

  allAgreeRow: { paddingVertical: 8 },
  allAgreeLeft: { flexDirection: 'row', alignItems: 'center' },
  allAgreeCheckBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  allAgreeCheckBoxOn: { backgroundColor: BLUE, borderColor: BLUE },
  allAgreeCheckIcon: { color: WHITE, fontSize: 16 },
  allAgreeText: { fontSize: 15, fontWeight: '600', color: '#222222' },

  sheetDivider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 12 },

  termRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  termBullet: { fontSize: 14, color: '#999999', marginRight: 8 },
  termBulletOn: { color: BLUE },
  termText: { fontSize: 14, color: '#222222' },

  sheetNextButton: {
    marginTop: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetNextButtonDisabled: { backgroundColor: '#BFDFFF' },
  sheetNextButtonText: { fontSize: 15, fontWeight: '600', color: WHITE },
});