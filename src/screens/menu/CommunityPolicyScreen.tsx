import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityPolicy'>;

export default function CommunityPolicyScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>커뮤니티 이용규칙</Text>

        <View style={styles.sideBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>커뮤니티 이용규칙 안내</Text>

        <Text style={styles.body}>
          이 커뮤니티는 모든 사용자가 서로 존중하며 자유롭게 의견을 나눌 수 있는 열린 공간입니다.
          {'\n\n'}
          건강한 커뮤니티 문화를 유지하기 위해 다음과 같은 기본 원칙을 지켜주시기 바랍니다.
          {'\n\n'}
          1. 타인을 존중해 주세요.
          {'\n'}
          다른 이용자에게 불쾌감이나 상처를 줄 수 있는 욕설, 비방, 조롱, 인신공격, 혐오 표현 등은 허용되지 않습니다.
          {'\n\n'}
          2. 허위정보 및 과장 광고를 금지합니다.
          {'\n'}
          확인되지 않은 정보, 허위 후기, 과장된 효능 표현, 상업적 홍보 목적의 게시물은 제한될 수 있습니다.
          {'\n\n'}
          3. 개인정보를 보호해 주세요.
          {'\n'}
          본인 또는 타인의 연락처, 주소, 주민번호, 계좌정보 등 민감한 개인정보를 게시하면 안 됩니다.
          {'\n\n'}
          4. 저작권을 준수해 주세요.
          {'\n'}
          타인의 사진, 영상, 음악, 글 등 저작물이 포함된 콘텐츠는 권리자의 허락 없이 무단으로 게시할 수 없습니다.
          {'\n\n'}
          5. 불법 및 유해 콘텐츠를 금지합니다.
          {'\n'}
          불법 행위 조장, 음란물, 도박, 마약, 자해·자살 유도 등 사회적으로 유해한 콘텐츠는 즉시 제한될 수 있습니다.
          {'\n\n'}
          6. 운영 정책 위반 시 제재될 수 있습니다.
          {'\n'}
          운영 원칙을 위반한 게시물은 예고 없이 삭제될 수 있으며, 이용 제한 또는 영구 정지 조치가 적용될 수 있습니다.
          {'\n\n'}
          7. 서비스 목적에 맞게 이용해 주세요.
          {'\n'}
          본 커뮤니티는 건강, 증상, 병원, 약국, 생활 관리 등 관련 정보 공유를 위한 공간입니다.
          {'\n\n'}
          8. 정책은 필요 시 변경될 수 있습니다.
          {'\n'}
          운영정책은 서비스 운영 상황에 따라 사전 고지 후 수정될 수 있습니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
  },

  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  sideBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  back: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },

  body: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555555',
  },
});