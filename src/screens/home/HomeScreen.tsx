// src/screens/HomeScreen.tsx
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
const BLUE = '#3FA2FF';
const TEXT_DARK = '#222222';
const TEXT_GRAY = '#777777';
const CARD_BG = '#FFFFFF';

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [hasNotification, setHasNotification] = useState(false);

  const handleBellPress = () => {
    console.log('알림 클릭');
    setHasNotification(false);
    // ✅ [수정] 알림 화면으로 이동
    navigation?.navigate('Notification');
  };

  const handleMenuPress = () => {
    console.log('메뉴 버튼 클릭');
  };

  const handleBigQPress = () => {
    console.log('어디가 아픈지 설명해주세요 카드 클릭');
  };

  const handleMapPress = () => {
    console.log('지도 카드 클릭');
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
        {/* ===== 상단 헤더 ===== */}
        <View style={styles.headerRow}>
          <Image
            source={require('../../assets/image/logo_mediqC.png')}
            style={styles.logo}
          />

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={handleBellPress}
              activeOpacity={0.8}
              style={styles.bellWrapper}
            >
              <Image
                source={require('../../assets/image/bell.png')}
                style={styles.bellIcon}
              />
              {hasNotification && <View style={styles.bellDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleMenuPress}
              activeOpacity={0.8}
              style={styles.menuWrapper}
            >
              <Image
                source={require('../../assets/image/buger.png')}
                style={styles.menuIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== 인사 + 프로필 ===== */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingText}>홍길동님{'\n'}안녕하세요.</Text>
          </View>
          <Image
            source={require('../../assets/image/profile.png')}
            style={styles.profileImage}
          />
        </View>

        {/* ===== 큰 Q 카드 ===== */}
        <TouchableOpacity
          style={styles.bigQCardWrapper}
          activeOpacity={0.9}
          onPress={handleBigQPress}
        >
          <Image
            source={require('../../assets/image/Qbtn.png')}
            style={styles.bigQCardImage}
          />
        </TouchableOpacity>

        {/* ===== 지도 / 광고 영역 ===== */}
        <View style={styles.cardsRow}>
          {/* 지도 카드 */}
          <TouchableOpacity
            style={styles.mapCardWrapper}
            activeOpacity={0.9}
            onPress={handleMapPress}
          >
            <Image
              source={require('../../assets/image/mapbtn.png')}
              style={styles.mapCardImage}
            />
          </TouchableOpacity>

          {/* 오른쪽 광고 위치 (하얀 박스) */}
          <View style={styles.rightCard}>
            <Text style={styles.adTitle}>병원 추천 카드</Text>
            <Text style={styles.adSubText}>광고 영역</Text>
          </View>
        </View>

        {/* ===== 실시간 인기글 카드 ===== */}
        <View style={styles.popularCard}>
          {/* 카드 상단 헤더 */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>실시간 인기글</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Image
                source={require('../../assets/image/next.png')}
                style={styles.nextIcon}
              />
            </TouchableOpacity>
          </View>

          {/* 헤더 아래 얇은 구분선 */}
          <View style={styles.headerDivider} />

          {/* ---- 게시글 1 ---- */}
          <View style={styles.postItem}>
            <View style={styles.postHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.postCategory}>오늘의 이슈</Text>
                <Text style={styles.postBadge}>NEW</Text>
              </View>
              <Text style={styles.postTime}>방금 전</Text>
            </View>
            <Text style={styles.postTitle}>모호한 단어</Text>
            <Text style={styles.postPreview} numberOfLines={2}>
              제가 어느 병원에 가야할지 모르겠어서 AI에게 물어봤습니다...
            </Text>
          </View>

          <View style={styles.itemDivider} />

          {/* ---- 게시글 2 ---- */}
          <View style={styles.postItem}>
            <View style={styles.postHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.postCategory}>병원 추천</Text>
                <Text style={styles.postBadge}>NEW</Text>
              </View>
              <Text style={styles.postTime}>5분 전</Text>
            </View>
            <Text style={styles.postTitle}>정형외과</Text>
            <Text style={styles.postPreview} numberOfLines={2}>
              이 병원 제가 가봤는데 정말 추천해요!
            </Text>
          </View>

          <View style={styles.itemDivider} />

          {/* ---- 게시글 3 ---- */}
          <View style={styles.postItem}>
            <View style={styles.postHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.postCategory}>오늘의 이슈</Text>
                <Text style={styles.postBadge}>NEW</Text>
              </View>
              <Text style={styles.postTime}>30분 전</Text>
            </View>
            <Text style={styles.postTitle}>부글부글거리는데</Text>
            <Text style={styles.postPreview} numberOfLines={2}>
              어느 진료과를 가야할까요? 경험 있으신 분들 의견 부탁드려요.
            </Text>
          </View>
        </View>

        {/* 스크롤 여백 */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 플로팅 Q 버튼 */}
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
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 32,
    paddingHorizontal: 20,
  },

  // 헤더
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 96,
    height: 30,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellWrapper: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  bellDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FF2B2B',
    borderWidth: 1.5,
    borderColor: BG,
  },
  menuWrapper: {
    marginLeft: 16,
  },
  menuIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  // 인사 + 프로필
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    lineHeight: 26,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'cover',
  },

  // 큰 Q 카드
  bigQCardWrapper: {
    marginBottom: 20,
  },
  bigQCardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },

  // 지도 / 광고 영역
  cardsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },

  // 지도 카드 → 높이 키우고 카드 스타일 부여
  mapCardWrapper: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapCardImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.1,
    resizeMode: 'contain', // 이미지 전체 보이게 (잘림 방지)
  },

  // 광고 placeholder 카드
  rightCard: {
    flex: 1,
    marginLeft: 10,
    height: 140,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  adTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  adSubText: {
    fontSize: 11,
    color: TEXT_GRAY,
  },

  // 실시간 인기글 카드 전체
  popularCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  // 카드 헤더
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BLUE,
  },
  nextButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextIcon: {
    width: 25,
    height: 25,
    tintColor: '#2F80ED'
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E6EBF5',
    marginTop: 10,
    marginBottom: 6,
  },

  // 게시글 공통
  postItem: {
    paddingVertical: 8,
  },
  postHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  postCategory: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginRight: 6,
  },
  postBadge: {
    fontSize: 10,
    color: '#FF4D4D',
    fontWeight: '700',
  },
  postTime: {
    fontSize: 11,
    color: TEXT_GRAY,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 3,
  },
  postPreview: {
    fontSize: 12,
    color: TEXT_GRAY,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#EEF1F8',
  },

  // 플로팅 Q 버튼
  floatingQButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
  },
  floatingQImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
});
