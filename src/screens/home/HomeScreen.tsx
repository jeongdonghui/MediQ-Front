// src/screens/home/HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyProfile } from '../../api/users';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const BLUE = '#0E7AF1';
const BLUE_DARK = '#075FC7';
const BLUE_LIGHT = '#67A9F5';
const BG = '#EEF4FF';
const WHITE = '#FFFFFF';
const TEXT = '#111827';
const SUB = '#6B7280';
const LINE = '#D9E9FF';
const SHADOW = '#0B4EA2';
const MINT = '#17B897';
const GOLD = '#D58A00';

type FeatureCardProps = {
  title: string;
  eyebrow?: string;
  description: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  tone?: 'blue' | 'mint' | 'gold';
};

function FeatureCard({
  title,
  eyebrow,
  description,
  icon,
  onPress,
  tone = 'blue',
}: FeatureCardProps) {
  const isMint = tone === 'mint';
  const isGold = tone === 'gold';

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        styles.featureCard,
        isMint && styles.featureCardMint,
        isGold && styles.featureCardGold,
      ]}
    >
      <View style={styles.featureTextArea}>
        {eyebrow && (
          <Text
            style={[
              styles.featureEyebrow,
              isMint && styles.mintText,
              isGold && styles.goldText,
            ]}
          >
            {eyebrow}
          </Text>
        )}

        <Text
          style={[
            styles.featureTitle,
            isMint && styles.mintText,
            isGold && styles.goldText,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.featureDesc}>{description}</Text>
      </View>

      <Image source={icon} style={styles.featureIcon} resizeMode="contain" />

      <View
        style={[
          styles.cardArrow,
          isMint && styles.cardArrowMint,
          isGold && styles.cardArrowGold,
        ]}
      >
        <Text
          style={[
            styles.cardArrowText,
            isMint && styles.mintText,
            isGold && styles.goldText,
          ]}
        >
          ›
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const KAKAO_REST_KEY = '80d6bbaa7590809cad13bf740446b4cc';
  const DEFAULT_LAT = 37.5665;
  const DEFAULT_LNG = 126.9780;

  const [hospitalData, setHospitalData] = useState<any[]>([
    {
      id: 'dummy',
      rank: 1,
      name: '로딩 중...',
      address: '주변 병원을 불러오고 있습니다.',
      rating: '0.0',
      review: '(0)',
      isAd: false,
      image: require('../../assets/home/hospital_1.png'),
    },
  ]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getMyProfile().catch((err) => {
      console.warn('Profile fetch failed on Home', err);
    });

    AsyncStorage.getItem('userRole').then((role) => {
      if (role === 'ADMIN') setIsAdmin(true);
    });

    async function fetchHospitals() {
      try {
        const res = await fetch(
          `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=HP8&y=${DEFAULT_LAT}&x=${DEFAULT_LNG}&radius=3000&sort=distance`,
          {
            headers: { Authorization: `KakaoAK ${KAKAO_REST_KEY}` },
          },
        );
        const data = await res.json();

        if (data.documents) {
          const topHospitals = data.documents.slice(0, 3);

          const enriched = await Promise.all(
            topHospitals.map(async (h: any, idx: number) => {
              let imgUri = null;

              try {
                const imgRes = await fetch(
                  `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(
                    h.place_name + ' 병원',
                  )}&size=1`,
                  {
                    headers: { Authorization: `KakaoAK ${KAKAO_REST_KEY}` },
                  },
                );
                const imgData = await imgRes.json();

                if (imgData.documents && imgData.documents.length > 0) {
                  imgUri = { uri: imgData.documents[0].image_url };
                }
              } catch (e) {}

              const defaults = [
                require('../../assets/home/hospital_1.png'),
                require('../../assets/home/hospital_2.png'),
                require('../../assets/home/hospital_3.png'),
              ];

              return {
                id: h.id,
                rank: idx + 1,
                name: h.place_name,
                address: h.road_address_name || h.address_name,
                rating: '4.' + (9 - idx),
                review: `(${300 - idx * 50}+)`,
                isAd: false,
                image: imgUri || defaults[idx % 3],
              };
            }),
          );

          setHospitalData(enriched);
        }
      } catch (err) {
        console.warn('Failed to fetch hospitals', err);
      }
    }

    fetchHospitals();
  }, []);

  const goDiagnosis = () => {
    navigation.navigate('BodySelect');
  };

  const goGuide = () => {
    navigation.navigate('Tutorial');
  };

  const goHospital = () => {
    navigation.navigate('KakaoMap', { target: 'hospital' });
  };

  const goPharmacy = () => {
    navigation.navigate('KakaoMap', { target: 'pharmacy' });
  };

  const goCommunityHome = () => {
    navigation.navigate('CommunityHome');
  };

  const goCalendar = () => {
    navigation.navigate('Calendar');
  };

  const goPremium = () => {
    navigation.navigate('SubscriptionService');
  };

  const goKakaoMap = () => {
    navigation.navigate('KakaoMap');
  };

  const goAdminDashboard = () => {
    navigation.navigate('AdminHome');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.heroCircle} />
            <View style={styles.heroCircleRight} />

            <View style={styles.heroTopIcons}>
              <TouchableOpacity
                style={styles.topIconBtn}
                onPress={() => navigation.navigate('Notification')}
              >
                <Image
                  source={require('../../assets/home/icon_bell_red.png')}
                  style={styles.topIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.topIconBtn}
                onPress={() =>
                  navigation.navigate('HamburgerMenu', { loginType: 'mediq' })
                }
              >
                <Image
                  source={require('../../assets/home/icon_menu.png')}
                  style={styles.topIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.heroInner}>
              <View style={styles.heroLeft}>
                <Text style={styles.heroTitle}>
                  내가 지금 어디가 아픈지{`\n`}
                  정확하게 알고싶다면?
                </Text>

                <View style={styles.heroBtnGroup}>
  <TouchableOpacity
    activeOpacity={0.86}
    style={styles.primaryBtn}
    onPress={goDiagnosis}
  >
    <Text style={styles.primaryBtnText}>지금 확인하기</Text>

    <Image
      source={require('../../assets/home/icon_hero_chevron_blue.png')}
      style={styles.heroChevronIcon}
      resizeMode="contain"
    />
  </TouchableOpacity>

  <TouchableOpacity
    activeOpacity={0.86}
    style={styles.secondaryBtn}
    onPress={goGuide}
  >
    <Image
      source={require('../../assets/home/icon_hero_guide_doc_white.png')}
      style={styles.heroGuideIcon}
      resizeMode="contain"
    />

    <Text style={styles.secondaryBtnText}>사용방법</Text>

    <Image
      source={require('../../assets/home/icon_hero_chevron_white.png')}
      style={styles.heroChevronIconWhite}
      resizeMode="contain"
    />
  </TouchableOpacity>
</View>
              </View>

              <View style={styles.heroRight}>
                <Image
                  source={require('../../assets/home/mediq_mascot.png')}
                  style={styles.mascot}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          <View style={styles.cardsSection}>
            <View style={styles.featureGrid}>
              <FeatureCard
                title="지도"
                description={`가까운 병원과 약국을\n한눈에 확인해요.`}
                icon={require('../../assets/home/icon_map_pin_3d.png')}
                onPress={goKakaoMap}
              />

              <FeatureCard
                title="커뮤니티"
                description={`질문하고 나누며\n함께 건강을 챙겨요.`}
                icon={require('../../assets/home/icon_community_3d.png')}
                onPress={goCommunityHome}
              />

              <FeatureCard
                eyebrow="내 건강 기록"
                title="캘린더"
                description={`검진, 투약, 일정까지\n한 번에 관리해요.`}
                icon={require('../../assets/home/icon_calendar_3d.png')}
                onPress={goCalendar}
                tone="mint"
              />

              <FeatureCard
                title="프리미엄 구독"
                description={`맞춤형 기능으로\n더 스마트하게.`}
                icon={require('../../assets/home/icon_premium_crown.png')}
                onPress={goPremium}
                tone="gold"
              />
            </View>

            <View style={styles.adBanner}>
              <View style={styles.adTextArea}>
                <View style={styles.adBadgeSmall}>
                  <Text style={styles.adBadgeSmallText}>광고</Text>
                </View>

                <Text style={styles.adTitle}>추천 건강기능식품</Text>
                <Text style={styles.adSub}>오늘의 건강, 좋은 습관으로 시작하세요!</Text>
              </View>

              <Image
                source={require('../../assets/home/ad_health_products.png')}
                style={styles.adProducts}
                resizeMode="contain"
              />
            </View>

            <View style={styles.quickBtnWrap}>
              <TouchableOpacity
                activeOpacity={0.86}
                style={styles.quickBtn}
                onPress={goHospital}
              >
                <Image
                  source={require('../../assets/home/icon_hospital_action.png')}
                  style={styles.quickIcon}
                  resizeMode="contain"
                />
                <Text style={styles.quickBtnText}>가까운 병원 찾기</Text>
                <Text style={styles.quickArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.86}
                style={styles.quickBtn}
                onPress={goPharmacy}
              >
                <Image
                  source={require('../../assets/home/icon_pharmacy_action.png')}
                  style={styles.quickIcon}
                  resizeMode="contain"
                />
                <Text style={styles.quickBtnText}>가까운 약국 찾기</Text>
                <Text style={styles.quickArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {isAdmin && (
              <TouchableOpacity
                activeOpacity={0.86}
                style={styles.adminBtn}
                onPress={goAdminDashboard}
              >
                <Text style={styles.adminBtnText}>관리자 대시보드</Text>
              </TouchableOpacity>
            )}

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>가까운 병원 찾기</Text>
                <Text style={styles.sectionSub}>거리 순으로 매핑된 결과입니다.</Text>
              </View>

              {hospitalData.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.hospitalItem,
                    index !== hospitalData.length - 1 && styles.hospitalItemGap,
                  ]}
                  activeOpacity={0.85}
                  onPress={goHospital}
                >
                  <View style={styles.thumbWrap}>
                    <Image
                      source={item.image}
                      style={styles.hospitalThumb}
                      resizeMode="cover"
                    />

                    <View style={styles.rankBadge}>
                      <Text style={styles.rankBadgeText}>{item.rank}</Text>
                    </View>

                    {item.isAd && (
                      <View style={styles.adBadge}>
                        <Text style={styles.adBadgeText}>광고</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.hospitalInfo}>
                    <Text style={styles.hospitalName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <Text style={styles.hospitalAddress} numberOfLines={2}>
                      {item.address}
                    </Text>

                    <View style={styles.metaRow}>
                      <Text style={styles.star}>★</Text>
                      <Text style={styles.rating}>{item.rating}</Text>
                      <Text style={styles.review}>{item.review}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 24 }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    paddingBottom: 28,
  },

  hero: {
  backgroundColor: BLUE,
  minHeight: 326,
  overflow: 'hidden',
  paddingHorizontal: 16,
  paddingTop: 10,
  paddingBottom: 30,
},

  heroCircle: {
    position: 'absolute',
    left: -135,
    top: -108,
    width: 490,
    height: 490,
    borderRadius: 245,
    backgroundColor: BLUE_LIGHT,
    opacity: 0.78,
  },

  heroCircleRight: {
    position: 'absolute',
    right: -170,
    bottom: -125,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#0072E8',
    opacity: 0.48,
  },
  heroBtnGroup: {
  alignItems: 'flex-start',
},

heroChevronIcon: {
  width: 15,
  height: 15,
},

heroGuideIcon: {
  width: 18,
  height: 18,
  marginRight: 8,
},

heroChevronIconWhite: {
  width: 14,
  height: 14,
  opacity: 0.95,
},

  heroTopIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    zIndex: 2,
  },

  topIconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topIcon: {
    width: 44,
    height: 28,
  },

  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 39,
    zIndex: 2,
  },

  heroLeft: {
  flex: 1,
  paddingRight: 6,
  paddingLeft: 0,
  alignItems: 'flex-start',
},

  heroRight: {
    width: 145,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroTitle: {
  color: WHITE,
  fontSize: 22,
  lineHeight: 32,
  fontWeight: '900',
  letterSpacing: -0.8,
  marginBottom: 18,
  textAlign: 'left',
},
  mascot: {
    width: 154,
    height: 188,
  },

  
 primaryBtn: {
  width: 164,
  height: 44,
  backgroundColor: WHITE,
  borderRadius: 13,
  borderWidth: 1,
  borderColor: '#D9E9FF',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 18,
  paddingRight: 15,
  marginBottom: 8,
  shadowColor: SHADOW,
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.11,
  shadowRadius: 8,
  elevation: 3,
},

primaryBtnText: {
  color: BLUE,
  fontSize: 13,
  fontWeight: '900',
  letterSpacing: -0.35,
},

secondaryBtn: {
  width: 164,
  height: 40,
  backgroundColor: 'rgba(255, 255, 255, 0.16)',
  borderRadius: 13,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.58)',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: 13,
  paddingRight: 15,
  shadowColor: '#0053B8',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 7,
  elevation: 2,
},

secondaryBtnText: {
  flex: 1,
  color: WHITE,
  fontSize: 12.5,
  fontWeight: '900',
  letterSpacing: -0.35,
},

heroArrowCircle: {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: '#F1F7FF',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#E2F0FF',
  shadowColor: '#0B4EA2',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.12,
  shadowRadius: 5,
  elevation: 2,
},

heroArrowText: {
  color: BLUE,
  fontSize: 23,
  lineHeight: 26,
  fontWeight: '900',
  marginTop: -2,
},

heroArrowCircleGhost: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: 'rgba(255, 255, 255, 0.18)',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.48)',
},

heroArrowTextGhost: {
  color: WHITE,
  fontSize: 21,
  lineHeight: 24,
  fontWeight: '900',
  marginTop: -2,
},

guideIconBox: {
  width: 22,
  height: 22,
  borderRadius: 5,
  borderWidth: 1.5,
  borderColor: WHITE,
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingLeft: 4,
  gap: 3,
},

guideIconLine: {
  width: 13,
  height: 1.5,
  borderRadius: 99,
  backgroundColor: WHITE,
},

  cardsSection: {
    marginTop: -32,
    paddingHorizontal: 16,
  },

  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  featureCard: {
    width: '48.6%',
    minHeight: 100,
    marginBottom: 12,
    backgroundColor: '#F8FBFF',
    borderRadius: 15,
    borderWidth: 1.3,
    borderColor: LINE,
    paddingTop: 17,
    paddingLeft: 17,
    paddingRight: 12,
    paddingBottom: 13,
    overflow: 'hidden',
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 4,
  },

  featureCardMint: {
    backgroundColor: '#F0FFFB',
    borderColor: '#CDEFE8',
  },

  featureCardGold: {
    backgroundColor: '#FFF8EB',
    borderColor: '#F6E2BD',
  },

  featureTextArea: {
    width: '60%',
    zIndex: 2,
  },

  featureEyebrow: {
    fontSize: 7,
    color: BLUE_DARK,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 2,
  },

  featureTitle: {
    color: BLUE_DARK,
    fontSize: 15,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: -0.9,
    marginBottom: 8,
  },

  featureDesc: {
    color: '#374151',
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '700',
    letterSpacing: -0,
  },

  mintText: {
    color: '#078E7A',
  },

  goldText: {
    color: GOLD,
  },

  featureIcon: {
    position: 'absolute',
    right: 2,
    top: 22,
    width: 90,
    height: 90,
  },

  cardArrow: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6E8FF',
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardArrowMint: {
    borderColor: '#BFE8DF',
  },

  cardArrowGold: {
    borderColor: '#F2D79D',
  },

  cardArrowText: {
    color: BLUE,
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '900',
    marginTop: -2,
  },

  adBanner: {
    minHeight: 130,
    backgroundColor: '#F4FAFF',
    borderRadius: 17,
    borderWidth: 1.3,
    borderColor: '#D8E9FF',
    paddingLeft: 18,
    paddingTop: 16,
    paddingBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },

  adTextArea: {
    flex: 1,
    zIndex: 2,
  },

  adBadgeSmall: {
    alignSelf: 'flex-start',
    backgroundColor: '#2F94FF',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginBottom: 9,
  },

  adBadgeSmallText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: -0.2,
  },

  adTitle: {
    color: '#0D2B55',
    fontSize: 15,
    lineHeight: 27,
    fontWeight: '900',
    letterSpacing: -0.9,
    marginBottom: 5,
  },

  adSub: {
    color: '#4B5563',
    fontSize: 10,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: -0.35,
  },

  adProducts: {
    width: 190,
    height: 106,
    marginRight: 1,
    marginLeft: -8,
  },

  quickBtnWrap: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  quickBtn: {
    width: '48.6%',
    height: 64,
    backgroundColor: WHITE,
    borderRadius: 17,
    borderWidth: 1.3,
    borderColor: '#CFE3FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  quickIcon: {
    width: 34,
    height: 34,
    marginRight: 10,
  },

  quickBtnText: {
    flex: 1,
    fontSize: 12,
    color: BLUE,
    fontWeight: '900',
    letterSpacing: -0.6,
  },

  quickArrow: {
    color: BLUE,
    fontSize: 18,
    lineHeight: 30,
    fontWeight: '900',
    marginLeft: 4,
  },

  adminBtn: {
    marginTop: 10,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },

  adminBtnText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '900',
  },

  sectionCard: {
    marginTop: 14,
    backgroundColor: WHITE,
    borderRadius: 17,
    padding: 15,
    shadowColor: SHADOW,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 15,
    lineHeight: 25,
    color: TEXT,
    fontWeight: '900',
    letterSpacing: -0.7,
    marginBottom: 4,
  },

  sectionSub: {
    fontSize: 12,
    color: '#98A2B3',
    fontWeight: '800',
    letterSpacing: -0.35,
  },

  hospitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  hospitalItemGap: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },

  thumbWrap: {
    width: 118,
    height: 92,
    marginRight: 14,
    position: 'relative',
  },

  rankBadge: {
    position: 'absolute',
    left: -8,
    top: -8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },

  rankBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '900',
  },

  adBadge: {
    position: 'absolute',
    right: -8,
    top: -6,
    minWidth: 42,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF4B4B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    zIndex: 3,
  },

  adBadgeText: {
    color: WHITE,
    fontSize: 10,
    fontWeight: '900',
  },

  hospitalThumb: {
    width: 118,
    height: 92,
    borderRadius: 14,
    backgroundColor: '#DDE8FF',
  },

  hospitalInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 2,
  },

  hospitalName: {
    fontSize: 18,
    color: TEXT,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: -0.7,
  },

  hospitalAddress: {
    fontSize: 12,
    color: SUB,
    marginBottom: 7,
    fontWeight: '700',
    lineHeight: 17,
    letterSpacing: -0.35,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  star: {
    color: '#F6C343',
    fontSize: 15,
    marginRight: 4,
  },

  rating: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '900',
    marginRight: 4,
  },

  review: {
    color: '#8B95A1',
    fontSize: 13,
    fontWeight: '800',
  },
});
