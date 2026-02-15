// src/screens/home/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

type Props = {
  navigation?: any;
};

const BG = '#F4F7FF';
const TEXT_DARK = '#222222';
const TEXT_GRAY = '#777777';
const CARD_BG = '#FFFFFF';

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [hasNotification, setHasNotification] = useState(false);

  const handleBellPress = () => {
    console.log('알림 클릭');
    setHasNotification(false);
    navigation?.navigate('Notification');
  };

  const handleMenuPress = () => {
    console.log('메뉴 버튼 클릭');
  };

  const handleCalendarPress = () => {
    console.log('캘린더 버튼 클릭');
  };

  const handleHeroPress = () => {
    console.log('상단 배너(지금 확인하기) 클릭');
  };

  const handleMapPress = () => {
    console.log('지도 카드 클릭');
  };

  const handleCommunityPress = () => {
    console.log('커뮤니티 카드 클릭');
  };

  const handleSmallCalendarPress = () => {
    console.log('캘린더 카드 클릭');
  };

  const handleQuickSettingPress = () => {
    console.log('퀵 설정 클릭');
  };

  const handlePremiumPress = () => {
    console.log('프리미엄 구독 클릭');
  };

  const handleNearHospitalPress = () => {
    console.log('가까운 병원 찾기 클릭');
  };

  const handleNearPharmacyPress = () => {
    console.log('가까운 약국 찾기 클릭');
  };

  const handleFloatingQPress = () => {
    console.log('플로팅 Q 버튼 클릭');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* =================== 상단 파란 배너 =================== */}
        <View style={styles.topBlueSection}>
          <View style={styles.topBlueOverlayCircle} />

          {/* 상단 헤더 */}
          <View style={styles.headerRow}>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={handleCalendarPress}
                activeOpacity={0.8}
                style={styles.headerIconBtn}
              >
                <Image
                  source={require('../../assets/image/calendar_black.png')}
                  style={styles.headerIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleBellPress}
                activeOpacity={0.8}
                style={styles.headerIconBtn}
              >
                <Image
                  source={
                    hasNotification
                      ? require('../../assets/image/red_bell.png')
                      : require('../../assets/image/bell.png')
                  }
                  style={styles.headerIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleMenuPress}
                activeOpacity={0.8}
                style={styles.headerIconBtn}
              >
                <Image
                  source={require('../../assets/image/buger.png')}
                  style={styles.menuIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 배너 내용 */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleHeroPress}
            style={styles.heroWrapper}
          >
            <View style={styles.heroCard}>
              <View style={styles.heroTextArea}>
                <Text style={styles.heroTitle}>어디가 아픈지 설명해주세요</Text>
                <Text style={styles.heroSub}>
                  모호한 언어를 의학 언어로 바꿔드립니다.
                </Text>
                <Text style={styles.heroCta}>지금 확인하기 &gt;</Text>
              </View>

              <Image
                source={require('../../assets/image/QQ.png')}
                style={styles.heroQQ}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* ✅ [CHANGED] 검색바를 topBlueSection 밖으로 빼서 "배너 아래 겹침" 구현 */}
        <View style={styles.searchBar}>
          <Image
            source={require('../../assets/image/logo_mediqC.png')}
            style={styles.searchLogo}
          />
          <Text style={styles.searchPlaceholder}>
            머리가 지끈, 속이 울렁, 니글거림 ...
          </Text>
        </View>

        {/* 기능 카드 영역 */}
        <View style={styles.featureRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleMapPress}
            style={styles.mapCard}
          >
            <Image
              source={require('../../assets/image/mapbtn.png')}
              style={styles.mapCardImage}
            />
          </TouchableOpacity>

          <View style={styles.rightStack}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleCommunityPress}
              style={styles.smallCard}
            >
              <View style={styles.smallCardInner}>
                <View>
                  <Text style={styles.smallCardTitle}>커뮤니티</Text>
                  <Text style={styles.smallCardSub}>가까운 병원/약국 찾기</Text>
                </View>
                <Image
                  source={require('../../assets/image/Hospital.png')}
                  style={styles.smallCardIcon}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSmallCalendarPress}
              style={styles.smallCard}
            >
              <View style={styles.smallCardInner}>
                <View>
                  <Text style={styles.smallCardTitle}>캘린더</Text>
                  <Text style={styles.smallCardSub}>내 일정 기록</Text>
                </View>
                <Image
                  source={require('../../assets/image/calender.png')}
                  style={styles.smallCardIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ [CHANGED] "위젯/프리미엄" + "오른쪽 프로모"를 디자인처럼 한 줄로 정렬 */}
        <View style={styles.lowerRow}>
          <View style={styles.lowerLeft}>
            <View style={styles.iconBtnRow}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleQuickSettingPress}
                style={styles.squareIconBtn}
              >
                <Image
                  source={require('../../assets/image/widget.png')}
                  style={styles.squareIcon}
                />
                <Text style={styles.squareIconText}>위젯 설정</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handlePremiumPress}
                style={[styles.squareIconBtn, { marginRight: 0 }]} // ✅ [CHANGED] 마지막 카드 마진 제거
              >
                <Image
                  source={require('../../assets/image/cash.png')}
                  style={styles.squareIcon}
                />
                <Text style={styles.squareIconText}>프리미엄 구독</Text>
              </TouchableOpacity>
            </View>

            {/* ✅ [CHANGED] 병원/약국 찾기 버튼: 더 밑에 일자로 길게 */}
            <View style={styles.segmentWrap}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleNearHospitalPress}
                style={styles.segmentSelected}
              >
                <Text style={styles.segmentSelectedText}>가까운 병원 찾기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleNearPharmacyPress}
                style={styles.segmentUnselected}
              >
                <Text style={styles.segmentUnselectedText}>가까운 약국 찾기</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.promoCard}>
            <Image
              source={require('../../assets/image/Hospital.png')}
              style={styles.promoImage}
            />
          </View>
        </View>

        {/* 병원 리스트 섹션(임시) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>가까운 병원 찾기</Text>
          <Text style={styles.sectionSub}>거리 순으로 매핑된 결과입니다.</Text>
        </View>

        <View style={styles.hospitalCard}>
          <Image
            source={require('../../assets/image/Hospital.png')}
            style={styles.hospitalImage}
          />
          <View style={styles.hospitalInfo}>
            <View style={styles.hospitalTopRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>1</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>광고</Text>
              </View>
            </View>

            <Text style={styles.hospitalName}>신촌연세병원</Text>
            <Text style={styles.hospitalAddr} numberOfLines={1}>
              서울 서대문구 연희로 413 2층
            </Text>
            <Text style={styles.hospitalMeta}>4.9 (200+) </Text>
          </View>

          <Image
            source={require('../../assets/image/profile.png')}
            style={styles.hospitalRightIcon}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingQButton}
        activeOpacity={0.9}
        onPress={handleFloatingQPress}
      >
        <Image
          source={require('../../assets/image/Qbtns.png')}
          style={styles.floatingQImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 18,
    paddingHorizontal: 18,
  },

  topBlueSection: {
    backgroundColor: '#4CAAF7',
    marginHorizontal: -18,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 54,
    marginBottom: 0,

    // ✅ [CHANGED] 파란 배경 하단 라운드 제거 (디자인처럼 일자)
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

    overflow: 'hidden',
  },

  topBlueOverlayCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.18)',
    left: -120,
    top: 10,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  headerIconBtn: {
    marginLeft: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: { width: 28, height: 28, resizeMode: 'contain' },
  menuIcon: { width: 28, height: 28, resizeMode: 'contain' },

  heroWrapper: { marginBottom: 0 },
  heroCard: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    paddingHorizontal: 6,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextArea: { flex: 1, paddingRight: 10 },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSub: {
    color: '#EAF6FF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  heroCta: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.95,
  },
  heroQQ: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
  },

  searchBar: {
    backgroundColor: CARD_BG,
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: -30,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  searchLogo: { width: 56, height: 20, resizeMode: 'contain', marginRight: 12 },
  searchPlaceholder: { color: TEXT_GRAY, fontSize: 12, flex: 1 },

  featureRow: { flexDirection: 'row', marginBottom: 14 },
  mapCard: {
    flex: 1,
    marginRight: 10,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  mapCardImage: { width: '100%', height: 170, resizeMode: 'contain' },

  // ✅ [CHANGED] 커뮤니티/캘린더 카드 쪽만 조정
  rightStack: {
    width: 160,
    justifyContent: 'space-between',
    gap: 10, // ✅ [CHANGED] 두 카드 간격을 일정하게
  },
  smallCard: {
    backgroundColor: '#5FB2FF',
    borderRadius: 16,

    // ✅ [CHANGED] 패딩/높이/그림자 조정(디자인 느낌)
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 84,

    // ✅ [CHANGED] 기존 marginBottom 유지(안전) — gap과 같이 있어도 문제 없음
    marginBottom: 10,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  smallCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallCardTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16, // ✅ [CHANGED]
    marginBottom: 6,
  },
  smallCardSub: {
    color: '#EAF6FF',
    fontSize: 11, // ✅ [CHANGED]
    fontWeight: '600',
  },
  smallCardIcon: {
    width: 34, // ✅ [CHANGED]
    height: 34,
    resizeMode: 'contain',
  },

  lowerRow: { flexDirection: 'row', marginBottom: 18 },
  lowerLeft: { flex: 1, marginRight: 10 },

  iconBtnRow: { flexDirection: 'row', marginBottom: 12 },
  squareIconBtn: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  squareIcon: { width: 24, height: 24, resizeMode: 'contain', marginBottom: 6 },
  squareIconText: { fontSize: 11, fontWeight: '700', color: TEXT_DARK },

  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: '#E9EDF4',
    borderRadius: 14,
    padding: 6,
    height: 54,
    alignItems: 'center',
  },
  segmentSelected: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  segmentSelectedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  segmentUnselected: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentUnselectedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },

  promoCard: {
    width: 150,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  promoImage: { width: '100%', height: 150, resizeMode: 'cover' },

  sectionHeader: { marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: TEXT_DARK },
  sectionSub: { marginTop: 4, fontSize: 11, color: TEXT_GRAY },

  hospitalCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  hospitalImage: { width: 110, height: 110, resizeMode: 'cover' },
  hospitalInfo: { flex: 1, padding: 10 },
  hospitalTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  rankBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#2F80ED', alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: '#FF4D4D' },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  hospitalName: { fontSize: 13, fontWeight: '800', color: TEXT_DARK, marginBottom: 4 },
  hospitalAddr: { fontSize: 11, color: TEXT_GRAY, marginBottom: 6 },
  hospitalMeta: { fontSize: 11, color: TEXT_GRAY },

  hospitalRightIcon: { width: 38, height: 38, resizeMode: 'contain', margin: 10 },

  floatingQButton: { position: 'absolute', right: 18, bottom: 18 },
  floatingQImage: { width: 64, height: 64, resizeMode: 'contain' },
});
