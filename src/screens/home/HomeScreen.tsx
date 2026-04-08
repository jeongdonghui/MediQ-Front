// src/screens/home/HomeScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const BLUE = '#0E7AF1';
const BLUE_LIGHT = '#67A9F5';
const BG = '#EEF4FF';
const WHITE = '#FFFFFF';
const TEXT = '#1F2937';
const SUB = '#98A2B3';
const SHADOW = '#000000';

export default function HomeScreen({ navigation }: Props) {
  const hospitalData = [
    {
      id: '1',
      rank: 1,
      name: '신촌연세병원',
      address: '서울 서대문구 통일로 413 2층',
      rating: '4.9',
      review: '(200+)',
      isAd: true,
      image: require('../../assets/home/hospital_1.png'),
    },
    {
      id: '2',
      rank: 2,
      name: 'JM가정의학과',
      address: '서울 마포구 월드컵북로 21',
      rating: '4.8',
      review: '(150+)',
      isAd: false,
      image: require('../../assets/home/hospital_2.png'),
    },
    {
      id: '3',
      rank: 3,
      name: '서울중앙의원',
      address: '서울 은평구 연서로 118',
      rating: '4.7',
      review: '(130+)',
      isAd: false,
      image: require('../../assets/home/hospital_3.png'),
    },
  ];

  const goDiagnosis = () => {
    navigation.navigate('BodySelect');
  };

  const goGuide = () => {
    navigation.navigate('Tutorial');
  };

  const goHospital = () => {
    navigation.navigate('PharmacyMap', { query: '병원' });
  };

  const goPharmacy = () => {
    navigation.navigate('PharmacyMap', { query: '약국' });
  };

  const goNotification = () => {
    navigation.navigate('Notification');
  };

  const goCommunityHome = () => {
    navigation.navigate('CommunityHome');
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

            <View style={styles.heroTopIcons}>
              <TouchableOpacity style={styles.topIconBtn} onPress={goNotification}>
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
                  내가 지금 어디가 아픈지{'\n'}
                  정확하게 알고싶다면?
                </Text>

                <TouchableOpacity style={styles.primaryBtn} onPress={goDiagnosis}>
                  <Text style={styles.primaryBtnText}>지금 확인하기 &gt;</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryBtn} onPress={goGuide}>
                  <Text style={styles.secondaryBtnText}>사용방법 &gt;</Text>
                </TouchableOpacity>
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
            <View style={styles.gridWrap}>
              <TouchableOpacity style={styles.mapCard} onPress={goHospital}>
                <Image
                  source={require('../../assets/home/map_card.png')}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={styles.rightCards}>
                <TouchableOpacity
                  style={styles.communityCard}
                  onPress={goCommunityHome}
                >
                  <Image
                    source={require('../../assets/home/community_card.png')}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.calendarCard}>
                  <Image
                    source={require('../../assets/home/calendar_card.png')}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.middleRow}>
              <TouchableOpacity style={styles.smallImageCard}>
                <Image
                  source={require('../../assets/home/icon_location_setting.png')}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
                <View style={styles.locationBox}>
                  <Text style={styles.boxText}>위젯 설정</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.smallImageCard}>
                <Image
                  source={require('../../assets/home/icon_premium.png')}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
                <View style={styles.premiumBox}>
                  <Text style={styles.boxText}>프리미엄 구독</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bannerCard}>
                <Image
                  source={require('../../assets/home/hospital_banner.png')}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.quickBtnWrap}>
              <TouchableOpacity style={styles.quickBtn} onPress={goHospital}>
                <Text style={styles.quickBtnText}>가까운 병원 찾기</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickBtn} onPress={goPharmacy}>
                <Text style={styles.quickBtnText}>가까운 약국 찾기</Text>
              </TouchableOpacity>
            </View>

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
                    <Text style={styles.hospitalName}>{item.name}</Text>

                    <Text style={styles.hospitalAddress}>{item.address}</Text>

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
    minHeight: 330,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 30,
  },

  heroCircle: {
    position: 'absolute',
    left: -150,
    top: -90,
    width: 470,
    height: 470,
    borderRadius: 999,
    backgroundColor: BLUE_LIGHT,
    opacity: 0.95,
  },

  heroTopIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 14,
    zIndex: 2,
  },

  topIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  topIcon: {
    width: 50,
    height: 30,
  },

  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    zIndex: 2,
  },

  heroLeft: {
    flex: 1,
    paddingRight: 8,
  },

  heroRight: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroTitle: {
    color: WHITE,
    fontSize: 21,
    lineHeight: 31,
    fontWeight: '900',
    marginBottom: 18,
  },

  mascot: {
    width: 150,
    height: 182,
  },

  primaryBtn: {
    backgroundColor: '#5B9BF7',
    borderRadius: 14,
    height: 42,
    width: 138,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: SHADOW,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },

  primaryBtnText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '900',
  },

  secondaryBtn: {
    backgroundColor: WHITE,
    borderRadius: 14,
    height: 42,
    width: 138,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SHADOW,
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },

  secondaryBtnText: {
    color: BLUE,
    fontSize: 13,
    fontWeight: '900',
  },

  cardsSection: {
    marginTop: -42,
    paddingHorizontal: 16,
  },

  gridWrap: {
    flexDirection: 'row',
  },

  mapCard: {
    flex: 1.5,
    height: 238,
  },

  rightCards: {
    flex: 1.3,
    height: 230,
  },

  communityCard: {
    height: 110,
  },

  calendarCard: {
    height: 110,
  },

  fullImage: {
    width: '100%',
    height: '100%',
  },

  middleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 0,
  },

  smallImageCard: {
    width: 93,
    height: 93,
    left: 7.5,
    position: 'relative',
  },

  locationBox: {
    position: 'absolute',
    bottom: -12,
    left: 18,
  },

  premiumBox: {
    position: 'absolute',
    bottom: -12,
    left: 10,
  },

  boxText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '800',
  },

  bannerCard: {
    flex: 1,
    height: 110,
  },

  quickBtnWrap: {
    marginTop: 14,
    backgroundColor: '#E7E7E7',
    borderRadius: 16,
    padding: 8,
    flexDirection: 'row',
    gap: 8,
  },

  quickBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickBtnText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '900',
  },

  sectionCard: {
    marginTop: 14,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '900',
    marginRight: 10,
  },

  sectionSub: {
    fontSize: 10,
    color: '#A0A7B4',
    fontWeight: '700',
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
    height: 96,
    marginRight: 14,
    position: 'relative',
  },

  rankBadge: {
    position: 'absolute',
    left: -8,
    top: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F83F1',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },

  rankBadgeText: {
    color: '#fff',
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
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },

  hospitalThumb: {
    width: 118,
    height: 96,
    borderRadius: 14,
    backgroundColor: '#DDE8FF',
  },

  hospitalInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 2,
  },

  hospitalName: {
    fontSize: 17,
    color: TEXT,
    fontWeight: '900',
    marginBottom: 6,
  },

  hospitalAddress: {
    fontSize: 11,
    color: SUB,
    marginBottom: 6,
    fontWeight: '600',
    lineHeight: 16,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  star: {
    color: '#F6C343',
    fontSize: 14,
    marginRight: 4,
  },

  rating: {
    color: '#555',
    fontSize: 12,
    fontWeight: '900',
    marginRight: 4,
  },

  review: {
    color: '#888',
    fontSize: 12,
    fontWeight: '700',
  },
});