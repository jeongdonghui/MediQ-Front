import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Image,
  Modal,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { getMyProfile, withdrawAccount } from '../../api/users';
import { logout } from '../../api/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export default function MenuScreen({ navigation, route }: Props) {
  const { loginType } = route.params;
  const isKakao = loginType === 'kakao';

  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userNickname, setUserNickname] = useState('로딩중');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();
        if (profile && profile.nickname) {
          setUserNickname(profile.nickname);
        } else if (profile && profile.name) {
          setUserNickname(profile.name);
        } else {
          setUserNickname('고객');
        }
      } catch (error) {
        setUserNickname('고객');
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout({ refreshToken: 'dummy_token' });
    } catch (e) {}
    setShowLogoutModal(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleWithdraw = async () => {
    try {
      await withdrawAccount();
    } catch (e) {}
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Text style={styles.back}>{'<'}</Text>
          </TouchableOpacity>

          <View style={styles.headerIcons}>
            <Image
              source={require('../../assets/home/icon_bell_red.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Image
              source={require('../../assets/home/icon_menu.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.accountSection}>
          <Text style={styles.grayText}>내 계정</Text>
          <Text style={styles.name}>{userNickname}님,</Text>
          
          <View style={styles.tierRow}>
            <Text style={styles.tierLabel}>회원등급</Text>
            {isKakao ? (
              <View style={styles.badgePremium}>
                <Text style={styles.badgePremiumText}>PREMIUM</Text>
              </View>
            ) : (
              <View style={styles.badgeBasic}>
                <Text style={styles.badgeBasicText}>BASIC</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>계정</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>아이디</Text>
            <Text style={styles.value}>hong123@naver.com</Text>
          </View>

          {!isKakao && (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <Text style={styles.label}>비밀번호 변경</Text>
              <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('PaymentMethod')}
          >
            <Text style={styles.label}>결제수단 관리</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.label}>계정연동</Text>
            {isKakao ? (
              <View style={styles.kakao}>
                <Text style={styles.kakaoText}>kakaotalk</Text>
              </View>
            ) : (
              <View style={styles.mediq}>
                <Text style={styles.mediqText}>MediQ</Text>
              </View>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>알림 설정</Text>
            <Switch
              value={alarmEnabled}
              onValueChange={setAlarmEnabled}
              trackColor={{ false: '#D1D5DB', true: '#6EA8FF' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>커뮤니티</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('RestrictionHistory')}
          >
            <Text style={styles.label}>이용 제한 내역</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('InterestKeyword')}
          >
            <Text style={styles.label}>관심 키워드 설정</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('CommunityPolicy')}
          >
            <Text style={styles.label}>커뮤니티 이용규칙</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>기타</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('InquiryHistory')}
          >
            <Text style={styles.label}>고객지원(1:1문의 상담)</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => setShowVersionModal(true)}>
            <Text style={styles.label}>버전정보</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('NoticeTerms')}
          >
            <Text style={styles.label}>공지사항 및 약관</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => setShowLogoutModal(true)}>
            <Text style={styles.label}>로그아웃</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={handleWithdraw}
          >
            <Text style={styles.danger}>회원탈퇴</Text>
            <Text style={styles.dangerArrow}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={showVersionModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.versionModalBox}>
            <Text style={styles.versionText}>6.3.8 v1906</Text>
            <View style={styles.modalDivider} />
            <TouchableOpacity onPress={() => setShowVersionModal(false)}>
              <Text style={styles.modalConfirm}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalBox}>
            <Text style={styles.confirmTitle}>로그아웃하시겠습니까?</Text>
            <View style={styles.modalDivider} />
            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>

              <View style={styles.confirmVertical} />

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleLogout}
              >
                <Text style={styles.actionText}>로그아웃</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    fontSize: 28,
    color: '#111111',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  icon: {
    width: 22,
    height: 22,
  },
  accountSection: {
    marginTop: 25,
  },
  grayText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  name: {
    marginTop: 10,
    marginBottom: 2,
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },
  tierLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
  },
  badgeBasic: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeBasicText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  badgePremium: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgePremiumText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF6A3D',
  },
  divider: {
    height: 1,
    backgroundColor: '#DADADA',
    marginVertical: 20,
  },
  sectionTitle: {
    color: '#9B9B9B',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '600',
  },
  value: {
    color: '#777777',
    fontSize: 14,
  },
  arrow: {
    color: '#777777',
    fontSize: 18,
    fontWeight: '700',
  },
  kakao: {
    backgroundColor: '#FEE500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  kakaoText: {
    fontWeight: 'bold',
    color: '#3C1E1E',
  },
  mediq: {
    backgroundColor: '#E9F1FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mediqText: {
    color: '#4F83F1',
    fontWeight: 'bold',
  },
  danger: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
  },
  dangerArrow: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  versionModalBox: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingTop: 22,
    paddingBottom: 12,
    paddingHorizontal: 18,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 16,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 10,
  },
  modalConfirm: {
    textAlign: 'center',
    color: '#6EA8FF',
    fontSize: 16,
    fontWeight: '700',
  },
  confirmModalBox: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingTop: 22,
  },
  confirmTitle: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 16,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmBtn: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmVertical: {
    width: 1,
    height: 46,
    backgroundColor: '#E5E7EB',
  },
  cancelText: {
    color: '#6EA8FF',
    fontSize: 15,
    fontWeight: '700',
  },
  actionText: {
    color: '#6EA8FF',
    fontSize: 15,
    fontWeight: '700',
  },
});