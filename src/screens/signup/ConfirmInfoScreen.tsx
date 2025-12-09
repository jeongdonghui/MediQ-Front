// src/screens/ConfirmInfoScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';

type Props = {
  navigation?: any;
  route?: any;
};

const TERMS_LIST = [
  'MediQ 이용약관 (필수)',
  '개인정보 수집 이용 동의 (필수)',
  '휴대폰 본인인증서비스 (필수)',
  '위치정보 이용약관 동의 (필수)',
  '마케팅 수신 동의 (필수)',
  '개인정보 광고활용 동의 (필수)',
];

const ConfirmInfoScreen: React.FC<Props> = ({ navigation, route }) => {
  const name = route?.params?.name ?? '';
  const carrier = route?.params?.carrier ?? '';
  const birthFront = route?.params?.birthFront ?? '';
  const birthBack = route?.params?.birthBack ?? '';
  const initialPhone = route?.params?.phone ?? '';

  const [phone, setPhone] = useState(initialPhone);
  const [modalVisible, setModalVisible] = useState(false);

  // 약관 체크 상태
  const [allAgree, setAllAgree] = useState(false);
  const [termChecks, setTermChecks] = useState<boolean[]>(
    Array(TERMS_LIST.length).fill(false),
  );

  const handleBack = () => {
    navigation?.goBack();
  };

  // 휴대폰 번호 입력 (숫자만, 11자리까지)
  const onChangePhone = (text: string) => {
    const onlyNums = text.replace(/[^0-9]/g, '');
    setPhone(onlyNums.slice(0, 11));
  };

  // 메인 화면 "다음" 버튼 활성화: 휴대폰번호 10~11자리일 때만
  const isMainNextDisabled = phone.length < 10;

  // 메인 다음 버튼 (정보 확인 → 약관 시트 오픈)
  const handleOpenTerms = () => {
    if (isMainNextDisabled) return;
    setModalVisible(true);
  };

  const handleCloseTerms = () => {
    setModalVisible(false);
  };

  const toggleAllAgree = () => {
    const next = !allAgree;
    setAllAgree(next);
    setTermChecks(Array(TERMS_LIST.length).fill(next));
  };

  const toggleSingleTerm = (index: number) => {
    const next = [...termChecks];
    next[index] = !next[index];

    setTermChecks(next);

    // 전체동의 체크 여부 갱신
    const everyChecked = next.every(v => v);
    setAllAgree(everyChecked);
  };

  // 약관 시트 안의 "다음" 버튼 활성화 여부 (모든 항목 체크)
  const isTermsNextDisabled = useMemo(
    () => !termChecks.every(v => v),
    [termChecks],
  );

  const handleTermsNext = () => {
    if (isTermsNextDisabled) return;

    console.log('약관 전체 동의 완료');
    console.log('최종 정보:', {
      name,
      carrier,
      birthFront,
      birthBack,
      phone,
    });

    // TODO: 실제 회원가입/인증 완료 화면으로 이동
    navigation?.navigate('VerifyCode', {
        phone,
        name,
        carrier,
        birthFront,
        birthBack,
    }

    );
  };

  // 생년월일 표기 (예시: 900101-*******)
  const birthMasked =
    birthFront && birthBack
      ? `${birthFront}-${'*'.repeat(7)}`
      : '';

  return (
    <View style={styles.container}>
      {/* 상단 뒤로가기 */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backText}>{'‹'}</Text>
      </TouchableOpacity>

      {/* 메인 내용 */}
      <View style={styles.content}>
        <Text style={styles.title}>
          입력한 정보를{'\n'}확인해주세요
        </Text>

        {/* 휴대폰번호 (입력 가능) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>휴대폰번호</Text>
          <TextInput
            style={styles.valueInput}
            value={phone}
            onChangeText={onChangePhone}
            keyboardType="number-pad"
            placeholder="01012345678"
            placeholderTextColor="rgba(255,255,255,0.8)"
          />
          <View style={styles.underline} />
        </View>

        {/* 통신사 */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>통신사</Text>
            <View style={styles.carrierRight}>
              <Text style={styles.valueText}>{carrier}</Text>
              <Text style={styles.dropdownArrow}>⌵</Text>
            </View>
          </View>
          <View style={styles.underline} />
        </View>

        {/* 생년월일 */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>생년월일</Text>
          <Text style={styles.valueText}>
            {birthMasked || `예시:${birthFront || '900101'} - *******`}
          </Text>
          <View style={styles.underline} />
        </View>

        {/* 이름 */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>이름</Text>
          <Text style={styles.valueText}>{name}</Text>
          <View style={styles.underline} />
        </View>
      </View>

      {/* 하단 "다음" 버튼 */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          isMainNextDisabled && styles.nextButtonDisabled,
        ]}
        activeOpacity={isMainNextDisabled ? 1 : 0.8}
        disabled={isMainNextDisabled}
        onPress={handleOpenTerms}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>

      {/* 약관동의 바텀 시트 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseTerms}
      >
        {/* 반투명 배경 */}
        <TouchableOpacity
          style={styles.sheetBackdrop}
          activeOpacity={1}
          onPress={handleCloseTerms}
        >
          <View />
        </TouchableOpacity>

        {/* 하단 시트 */}
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>약관동의</Text>

          {/* 전체동의 */}
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
                {allAgree && <Text style={styles.allAgreeCheckIcon}>✓</Text>}
              </View>
              <Text style={styles.allAgreeText}>전체동의</Text>
            </View>
          </TouchableOpacity>

          {/* 구분선 */}
          <View style={styles.sheetDivider} />

          {/* 개별 약관 리스트 */}
          {TERMS_LIST.map((label, idx) => {
            const checked = termChecks[idx];
            return (
              <TouchableOpacity
                key={label}
                style={styles.termRow}
                activeOpacity={0.8}
                onPress={() => toggleSingleTerm(idx)}
              >
                <Text
                  style={[
                    styles.termBullet,
                    checked && styles.termBulletOn,
                  ]}
                >
                  ✓
                </Text>
                <Text style={styles.termText}>{label}</Text>
              </TouchableOpacity>
            );
          })}

          {/* 시트 안의 "다음" 버튼 */}
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
      </Modal>
    </View>
  );
};

export default ConfirmInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  backButton: {
    paddingVertical: 4,
    marginBottom: 8,
  },
  backText: {
    fontSize: 20,
    color: WHITE,
    fontWeight: '400',
  },

  content: {
    flex: 1,
    marginTop: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: WHITE,
    lineHeight: 34,
    marginBottom: 40,
  },

  fieldGroup: {
    marginBottom: 24,
  },

  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 13,
    color: WHITE,
    opacity: 0.9,
    marginBottom: 8,
  },

  valueText: {
    fontSize: 16,
    color: WHITE,
    paddingVertical: 4,
  },

  valueInput: {
    fontSize: 16,
    color: WHITE,
    paddingVertical: 4,
  },

  underline: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  carrierRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dropdownArrow: {
    fontSize: 14,
    color: WHITE,
  },

  // 메인 다음 버튼 (이전 화면과 동일 위치/스타일)
  nextButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE,
  },

  // 약관 시트
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheetContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },

  allAgreeRow: {
    paddingVertical: 8,
  },
  allAgreeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  allAgreeCheckBoxOn: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  allAgreeCheckIcon: {
    color: WHITE,
    fontSize: 16,
  },
  allAgreeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },

  sheetDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },

  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  termBullet: {
    fontSize: 14,
    color: '#999999',
    marginRight: 8,
  },
  termBulletOn: {
    color: BLUE, // ✅ 체크된 항목은 파란색
  },
  termText: {
    fontSize: 14,
    color: '#222222',
  },

  sheetNextButton: {
    marginTop: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetNextButtonDisabled: {
    backgroundColor: '#BFDFFF',
  },
  sheetNextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: WHITE,
  },
});
