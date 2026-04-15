import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentCardAdd'>;

export default function PaymentCardAddScreen({ navigation }: Props) {
  const [birth, setBirth] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [password2, setPassword2] = useState('');

  const isValid = useMemo(() => {
    const rawCard = cardNumber.replace(/[^0-9]/g, '');
    const rawExpiry = expiry.replace(/[^0-9]/g, '');

    return (
      birth.length === 6 &&
      rawCard.length === 16 &&
      rawExpiry.length === 4 &&
      password2.length === 2
    );
  }, [birth, cardNumber, expiry, password2]);

  const formatCardNumber = (value: string) => {
    const onlyNum = value.replace(/[^0-9]/g, '').slice(0, 16);
    const groups = onlyNum.match(/.{1,4}/g);
    return groups ? groups.join(' - ') : onlyNum;
  };

  const formatExpiry = (value: string) => {
    const onlyNum = value.replace(/[^0-9]/g, '').slice(0, 4);
    if (onlyNum.length < 3) return onlyNum;
    return `${onlyNum.slice(0, 2)} / ${onlyNum.slice(2)}`;
  };

  const handleSubmit = () => {
    if (!isValid) {
      Alert.alert('안내', '입력값을 다시 확인해주세요.');
      return;
    }

    const rawNumber = cardNumber.replace(/[^0-9]/g, '');
    const masked = `${rawNumber.slice(0, 4)}-${rawNumber.slice(4, 8)}-****-${rawNumber.slice(12, 16)}`;

    navigation.navigate('PaymentMethod', {
      newCard: {
        id: String(Date.now()),
        company: '국민',
        numberMasked: masked,
        isBasic: true,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.sideBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.back}>{'<'}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>카드 등록</Text>

          <View style={styles.sideBtn} />
        </View>

        <View style={styles.formBlock}>
          <Text style={styles.label}>생년월일(6자리)</Text>
          <TextInput
            style={styles.input}
            placeholder="991231"
            placeholderTextColor="#C7C7CC"
            keyboardType="number-pad"
            value={birth}
            onChangeText={(text) => setBirth(text.replace(/[^0-9]/g, '').slice(0, 6))}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.formBlock}>
          <Text style={styles.label}>카드번호</Text>
          <TextInput
            style={styles.input}
            placeholder="0000 - 0000 - 0000 - 0000"
            placeholderTextColor="#C7C7CC"
            keyboardType="number-pad"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.formBlock}>
          <Text style={styles.label}>유효기간</Text>
          <TextInput
            style={styles.input}
            placeholder="MM / YY"
            placeholderTextColor="#C7C7CC"
            keyboardType="number-pad"
            value={expiry}
            onChangeText={(text) => setExpiry(formatExpiry(text))}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.formBlock}>
          <Text style={styles.label}>카드 비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="앞 두자리"
            placeholderTextColor="#C7C7CC"
            keyboardType="number-pad"
            secureTextEntry
            value={password2}
            onChangeText={(text) => setPassword2(text.replace(/[^0-9]/g, '').slice(0, 2))}
          />
        </View>

        <View style={styles.bottomWrap}>
          <TouchableOpacity
            style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text style={styles.submitBtnText}>등록</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },

  sideBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  back: {
    fontSize: 24,
    color: '#111827',
    fontWeight: '600',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },

  formBlock: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: '#F8F8F8',
  },

  label: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },

  input: {
    height: 58,
    borderWidth: 1.2,
    borderColor: '#D9D9DE',
    borderRadius: 14,
    paddingHorizontal: 18,
    backgroundColor: '#F8F8F8',
    fontSize: 18,
    color: '#111827',
  },

  divider: {
    height: 1,
    backgroundColor: '#ECECEF',
  },

  bottomWrap: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },

  submitBtn: {
    height: 58,
    borderRadius: 18,
    backgroundColor: '#6EA8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitBtnDisabled: {
    backgroundColor: '#D9DADD',
  },

  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});