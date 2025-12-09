// src/screens/BirthdateScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';

type Props = {
  navigation?: any;
  route?: any;
};

const CARRIERS = [
  'SKT',
  'KT',
  'LG U+',
  'SKT 알뜰폰',
  'KT 알뜰폰',
  'LG U+ 알뜰폰',
];

const BirthdateScreen: React.FC<Props> = ({ navigation, route }) => {
  const nameFromPrev = route?.params?.name ?? '';

  const [carrier, setCarrier] = useState<string | null>(null);
  const [birthFront, setBirthFront] = useState('');
  const [birthBack, setBirthBack] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleBack = () => {
    navigation?.goBack();
  };

  const openCarrierSheet = () => {
    setSheetVisible(true);
  };

  const closeCarrierSheet = () => {
    setSheetVisible(false);
  };

  const handleSelectCarrier = (value: string) => {
    setCarrier(value);
    setSheetVisible(false);
  };

  const handleNext = () => {
    if (isNextDisabled) return;

    const birth = `${birthFront}-${birthBack}`;
    console.log('통신사:', carrier);
    console.log('생년월일:', birth);
    console.log('이름:', nameFromPrev);

    // TODO: 다음 단계 화면으로 이동
    navigation?.navigate('ConfirmInfo', {
     name: nameFromPrev,
     carrier,
     birthFront,
     birthBack,
    });
  };

  const isNextDisabled =
    !carrier || birthFront.length !== 6 || birthBack.length !== 7;

  return (
    <View style={styles.container}>
      {/* 상단 뒤로가기 */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backText}>{'‹'}</Text>
      </TouchableOpacity>

      {/* 메인 내용 */}
      <View style={styles.content}>
        <Text style={styles.title}>
          생년월일을{'\n'}입력해주세요
        </Text>

        {/* 통신사 필드 */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>통신사</Text>
            <TouchableOpacity
              onPress={openCarrierSheet}
              style={styles.carrierSelect}
              activeOpacity={0.8}
            >
              <Text style={styles.carrierText}>
                {carrier ?? ''}
              </Text>
              <Text style={styles.dropdownArrow}>⌵</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.underline} />
        </View>

        {/* 생년월일 */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>생년월일</Text>

          <View style={styles.birthRow}>
            <TextInput
              style={[styles.birthInput, styles.birthFrontInput]}
              value={birthFront}
              onChangeText={text => {
                const onlyNums = text.replace(/[^0-9]/g, '');
                setBirthFront(onlyNums.slice(0, 6));
              }}
              placeholder="예시:900101"
              placeholderTextColor="rgba(255,255,255,0.8)"
              keyboardType="number-pad"
              maxLength={6}
            />
            <Text style={styles.hyphen}>-</Text>
            <TextInput
              style={[styles.birthInput, styles.birthBackInput]}
              value={birthBack}
              onChangeText={text => {
                const onlyNums = text.replace(/[^0-9]/g, '');
                setBirthBack(onlyNums.slice(0, 7));
              }}
              keyboardType="number-pad"
              secureTextEntry={true}
              maxLength={7}
            />
          </View>
          <View style={styles.underline} />
        </View>

        {/* 이름 (읽기 전용) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>이름</Text>
          <Text style={styles.nameValue}>{nameFromPrev}</Text>
          <View style={styles.underline} />
        </View>
      </View>

      {/* 하단 다음 버튼 (NameInputScreen 과 위치/스타일 통일) */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          isNextDisabled && styles.nextButtonDisabled,
        ]}
        activeOpacity={isNextDisabled ? 1 : 0.8}
        disabled={isNextDisabled}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>

      {/* 통신사 선택 시트 */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={closeCarrierSheet}
      >
        <TouchableOpacity
          style={styles.sheetBackdrop}
          activeOpacity={1}
          onPress={closeCarrierSheet}
        >
          <View />
        </TouchableOpacity>

        <View style={styles.sheetContainer}>
          {CARRIERS.map(item => {
            const selected = carrier === item;
            return (
              <TouchableOpacity
                key={item}
                style={styles.sheetRow}
                activeOpacity={0.8}
                onPress={() => handleSelectCarrier(item)}
              >
                <Text style={styles.sheetText}>{item}</Text>
                <View style={styles.radioOuter}>
                  {selected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

export default BirthdateScreen;

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

  underline: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  carrierSelect: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carrierText: {
    fontSize: 15,
    color: WHITE,
    marginRight: 4,
  },
  dropdownArrow: {
    fontSize: 14,
    color: WHITE,
  },

  birthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  birthInput: {
    fontSize: 16,
    color: WHITE,
    paddingVertical: 4,
  },
  birthFrontInput: {
    width: 120,
  },
  birthBackInput: {
    width: 90,
    letterSpacing: 4,
  },
  hyphen: {
    fontSize: 18,
    color: WHITE,
    marginHorizontal: 8,
  },

  nameValue: {
    fontSize: 16,
    color: WHITE,
    paddingVertical: 4,
  },

  // 하단 다음 버튼 (NameInputScreen과 동일 위치 느낌)
  nextButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80, // NameInputScreen에서 너가 맞춰둔 값과 동일
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE,
  },

  // 통신사 선택 시트
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheetContainer: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  sheetText: {
    fontSize: 15,
    color: '#222222',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BLUE,
  },
});
