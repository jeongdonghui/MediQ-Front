import React, { useState } from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'HamburgerMenu'>;

function StatCard({
  title,
  value,
  unit,
  titleColor,
  bgColor,
}: {
  title: string;
  value: string;
  unit: string;
  titleColor: string;
  bgColor: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <Text style={[styles.statTitle, { color: titleColor }]}>{title}</Text>
      <Text style={styles.statDate}>25.11.14</Text>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statUnit}> {unit}</Text>
      </View>
    </View>
  );
}

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
  const [widgetEnabled, setWidgetEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

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
        <Text style={styles.userName}>홍길동님,</Text>

        <View style={styles.statsRow}>
          <StatCard
            title="걸음수"
            value="1555"
            unit="걸음"
            titleColor="#5B9BF7"
            bgColor="#DDEBFF"
          />
          <StatCard
            title="칼로리"
            value="155"
            unit="Kcal"
            titleColor="#FF6A3D"
            bgColor="#FFFFFF"
          />
          <StatCard
            title="이동거리"
            value="3.0"
            unit="km"
            titleColor="#5B9BF7"
            bgColor="#DDEBFF"
          />
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
          <MenuRow label="리포트" />
          <MenuRow label="캘린더" />
          <MenuRow label="커뮤니티" />
          <MenuRow label="지도" />
          <MenuRow
            label="위젯 설정"
            right={
              <Switch
                value={widgetEnabled}
                onValueChange={setWidgetEnabled}
                trackColor={{ false: '#D1D5DB', true: '#6EA8FF' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <MenuRow label="프리미엄 구독" />
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
    marginTop: 4,
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  statsRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '31%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 14,
  },
  statDate: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'right',
    marginBottom: 6,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  statUnit: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
    marginBottom: 1,
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
    marginTop:10,
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