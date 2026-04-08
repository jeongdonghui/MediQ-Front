// src/screens/subscription/GooglePaymentScreen.tsx
import React from 'react';
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
  route?: any;
};

const BLUE = '#52A8F8';
const WHITE = '#FFFFFF';
const TEXT_DARK = '#3E3E3E';
const TEXT_GRAY = '#8A8A8A';
const LINE = '#D9D9D9';
const BUTTON_BLUE = '#4E7EEB';

export default function GooglePaymentScreen({ navigation, route }: Props) {
  const selectedPlan = route?.params?.selectedPlan ?? 'monthly';

  const priceText =
    selectedPlan === 'quarterly' ? '₩8900/3개월' : '₩3900/개월';

  const handleClose = () => {
    navigation?.goBack(); // ✅ [CHANGED] X 누르면 이전 화면으로 돌아가기
  };

  const handleSubscribe = () => {
    // ✅ [나중에 연결할 위치]
    // 실제 결제 연동 전:
    // 결제 완료 mock 화면 또는 다음 단계로 연결 가능
    //
    // 실제 결제 연동 시:
    // 여기서 Google Play Billing 호출
    console.log('정기 결제 진행');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BLUE} />

      <View style={styles.container}>
        {/* 상단 파란 영역 */}
        <View style={styles.topBlueArea} />

        {/* 하단 결제 영역 */}
        <View style={styles.content}>
          {/* ✅ [CHANGED] Google Play 라인과 X 버튼을 같은 줄에 배치 */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Google Play</Text>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* 상품 정보 */}
          <View style={styles.productRow}>
            <Image
              source={require('../../assets/image/google_mediq_logo.png')}
              style={styles.productIcon}
              resizeMode="contain"
            />

            <View style={styles.productTextBox}>
              <Text style={styles.productTitle}>MediQ - 월간 구독</Text>
              <Text style={styles.productSubtitle}>
                MediQ (메디큐) - 무제한 챗봇, 광고제거
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>시작일: 오늘</Text>
            <Text style={styles.infoPrice}>{priceText}</Text>
          </View>

          <Text style={styles.taxText}>포함된 세금 보기 ⓘ</Text>

          <Text style={styles.description}>
            Google Play의 정기 결제 페이지에서 언제든지 취소할 수 있습니다.
          </Text>

          <View style={styles.divider} />

          {/* 결제수단 1 */}
          <View style={styles.paymentRow}>
            <View style={styles.paymentLeft}>
              <Image
                source={require('../../assets/image/playstore.png')}
                style={styles.paymentIcon}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.paymentTitle}>Play 포인트 - 골드</Text>
                <Text style={styles.paymentSub}>+19포인트 적립</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 결제수단 2 */}
          <View style={styles.paymentRow}>
            <View style={styles.paymentLeft}>
              <Image
                source={require('../../assets/image/card.png')}
                style={styles.cardIcon}
                resizeMode="contain"
              />
              <Text style={styles.paymentTitle}>Mastercard-9996</Text>
            </View>

            <View style={styles.arrowCircle}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.bottomNotice}>
            정기 결제를 통해 서비스를 계속 사용할 것을 동의하는 데 동의하게 됩니다.
            Google Play 서비스를 약관은 본문 계약이 변경되면 달리 표시됩니다.
            취소 방법 알아보기 · 더보기
          </Text>

          <TouchableOpacity
            style={styles.subscribeButton}
            activeOpacity={0.85}
            onPress={handleSubscribe}
          >
            <Text style={styles.subscribeButtonText}>정기 결제</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ [나중에 연결할 위치 안내]
            SubscriptionServiceScreen의 handleContinue 안에서
            아래처럼 연결하면 됨.

            navigation?.navigate('GooglePayment', {
              selectedPlan,
            });

            그리고 AppNavigator에 나중에 등록:
            <Stack.Screen
              name="GooglePayment"
              component={GooglePaymentScreen}
            />
        */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BLUE,
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },

  topBlueArea: {
    height: 155,
    backgroundColor: BLUE,
  },

  headerRow: {
    flexDirection: 'row', // ✅ [CHANGED]
    alignItems: 'center', // ✅ [CHANGED]
    justifyContent: 'space-between', // ✅ [CHANGED]
    marginBottom: 14, // ✅ [CHANGED]
  },

  closeButton: {
    padding: 4, // ✅ [CHANGED]
  },
  closeText: {
    color: TEXT_GRAY,
    fontSize: 18,
    fontWeight: '500',
  },

  content: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    // ✅ [CHANGED] 기존 marginBottom 제거
  },

  divider: {
    height: 1,
    backgroundColor: LINE,
    marginVertical: 14,
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    marginRight: 12,
  },
  productTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 11,
    color: TEXT_GRAY,
    lineHeight: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  infoLabel: {
    fontSize: 13,
    color: TEXT_DARK,
    fontWeight: '500',
  },
  infoPrice: {
    fontSize: 16,
    color: TEXT_DARK,
    fontWeight: '700',
  },

  taxText: {
    fontSize: 11,
    color: TEXT_GRAY,
    marginBottom: 10,
  },

  description: {
    fontSize: 12,
    color: TEXT_GRAY,
    lineHeight: 18,
  },

  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  cardIcon: {
    width: 28,
    height: 20,
    marginRight: 12,
  },
  paymentTitle: {
    fontSize: 13,
    color: TEXT_DARK,
    fontWeight: '500',
  },
  paymentSub: {
    fontSize: 11,
    color: TEXT_GRAY,
    marginTop: 2,
  },

  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E7EBF3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#7E8796',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '500',
  },

  bottomNotice: {
    fontSize: 10.5,
    color: TEXT_GRAY,
    lineHeight: 16,
    marginTop: 2,
    marginBottom: 18,
  },

  subscribeButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: BUTTON_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  subscribeButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },
});