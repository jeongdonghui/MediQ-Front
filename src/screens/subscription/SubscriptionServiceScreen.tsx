// src/screens/subscription/SubscriptionServiceScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

type Props = {
  navigation?: any;
};

const BLUE = '#52A8F8';
const WHITE = '#FFFFFF';
const LIGHT_BLUE = '#E6F2FF';
const BORDER_BLUE = '#2D63D6';
const TEXT_DARK = '#2453B3';
const TEXT_LIGHT = '#6B8FB8';

export default function SubscriptionServiceScreen({ navigation }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly'>(
    'monthly',
  );

  const handleClose = () => {
    navigation?.goBack();
  };

  const handleContinue = () => {
    navigation?.navigate('GooglePayment', {
      selectedPlan,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <View style={styles.container}>
        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>

        {/* 로고 */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/image/mediq_character.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* 설명 */}
        <Text style={styles.description}>
          MediQ를 광고 없이 더 빠르게,{'\n'}
          AI 챗봇은 무제한으로 대화하세요.
        </Text>

        {/* 플랜 */}
        <View style={styles.planSection}>
          {/* 3개월 */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('quarterly')}
            style={[
              styles.planButton,
              selectedPlan === 'quarterly'
                ? styles.planSelected
                : styles.planUnselected,
            ]}
          >
            <View
              style={[
                styles.radioOuter,
                selectedPlan === 'quarterly'
                  ? styles.radioSelected
                  : styles.radioUnselected,
              ]}
            >
              {selectedPlan === 'quarterly' && (
                <View style={styles.radioInner} />
              )}
            </View>

            <Text
              style={
                selectedPlan === 'quarterly'
                  ? styles.textSelected
                  : styles.textUnselected
              }
            >
              ₩8900 / 3개월
            </Text>

            {selectedPlan === 'quarterly' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>💎 Premium</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* 월 */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('monthly')}
            style={[
              styles.planButton,
              selectedPlan === 'monthly'
                ? styles.planSelected
                : styles.planUnselected,
            ]}
          >
            <View
              style={[
                styles.radioOuter,
                selectedPlan === 'monthly'
                  ? styles.radioSelected
                  : styles.radioUnselected,
              ]}
            >
              {selectedPlan === 'monthly' && (
                <View style={styles.radioInner} />
              )}
            </View>

            <Text
              style={
                selectedPlan === 'monthly'
                  ? styles.textSelected
                  : styles.textUnselected
              }
            >
              ₩3900 / 월
            </Text>

            {selectedPlan === 'monthly' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>💎 Premium</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 계속 */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>계속</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BLUE },

  container: {
    flex: 1,
    backgroundColor: BLUE,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: 18,
    right: 22,
  },

  closeText: {
    color: WHITE,
    fontSize: 18,
  },

  logoWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logoImage: {
    width: 250,
    height: 180,
  },

  description: {
    color: WHITE,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 30,
  },

  planSection: {
    gap: 12,
  },

  planButton: {
    height: 60,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },

  planUnselected: {
    backgroundColor: LIGHT_BLUE,
  },

  planSelected: {
    backgroundColor: WHITE,
    borderWidth: 3,
    borderColor: BORDER_BLUE,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioUnselected: {
    borderWidth: 2,
    borderColor: '#AFC8E8',
  },

  radioSelected: {
    borderWidth: 2,
    borderColor: BORDER_BLUE,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BORDER_BLUE,
  },

  textSelected: {
    color: TEXT_DARK,
    fontWeight: '700',
    fontSize: 16,
  },

  textUnselected: {
    color: TEXT_LIGHT,
    fontWeight: '700',
    fontSize: 16,
  },

  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: BORDER_BLUE,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 10,
    height: 28,
    justifyContent: 'center',
  },

  badgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },

  continueBtn: {
    marginTop: 20,
    height: 44,
    borderRadius: 10,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueText: {
    color: BORDER_BLUE,
    fontWeight: '700',
  },
});