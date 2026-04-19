import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { getMyProfile } from '../../api/users';

type Props = NativeStackScreenProps<RootStackParamList, 'HamburgerMenu'>;



function MenuRow({
  label,
  onPress,
  right,
}: {
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      style={styles.menuRow}
    >
      <Text style={styles.menuLabel}>{label}</Text>
      {right ?? <Text style={styles.arrow}>{'>'}</Text>}
    </TouchableOpacity>
  );
}

export default function HamburgerMenuScreen({ navigation, route }: Props) {
  const { loginType } = route.params;
  const [voiceEnabled, setVoiceEnabled] = useState(true);
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View style={styles.fakeSpace} />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.close}>X</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionSubTitle}>내 계정</Text>
        <Text style={styles.userName}>{userNickname}님,</Text>
        <View style={styles.tierRow}>
          <Text style={styles.tierLabel}>회원등급</Text>
          <View style={styles.badgeBasic}>
            <Text style={styles.badgeBasicText}>BASIC</Text>
          </View>
        </View>



        <TouchableOpacity
          style={styles.infoCard}
          onPress={() => navigation.navigate('Menu', { loginType })}
        >
          <Text style={styles.infoCardText}>내 정보</Text>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionSubTitle}>기능</Text>

        <View style={styles.blockCard}>
          <MenuRow
            label="리포트"
            onPress={() => navigation.navigate('BodySelect')}
          />
          <MenuRow
            label="캘린더"
            onPress={() => navigation.navigate('Calendar')}
          />
          <MenuRow
            label="커뮤니티"
            onPress={() => navigation.navigate('CommunityHome')}
          />
          <MenuRow
            label="지도"
            onPress={() => navigation.navigate('KakaoMap')}
          />

          <MenuRow
            label="프리미엄 구독"
            onPress={() => navigation.navigate('SubscriptionService')}
          />
        </View>

        <View style={styles.voiceCard}>
          <View>
            <Text style={styles.voiceTitle}>캐릭터 음성으로 진행하기</Text>
            <Text style={styles.voiceDesc}>
              각장애인을 위해 음성 안내 중심으로 진행됩니다.
            </Text>
          </View>

          <Switch
            value={voiceEnabled}
            onValueChange={setVoiceEnabled}
            trackColor={{ false: '#D1D5DB', true: '#6EA8FF' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fakeSpace: {
    width: 20,
  },
  close: {
    fontSize: 20,
    color: '#111827',
  },
  sectionSubTitle: {
    marginTop: 14,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  userName: {
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

  infoCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCardText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B5563',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9DDE3',
    marginTop: 20,
    marginBottom: 26,
  },
  blockCard: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  menuRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLabel: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '700',
  },
  voiceCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  voiceTitle: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '700',
    marginBottom: 6,
  },
  voiceDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});