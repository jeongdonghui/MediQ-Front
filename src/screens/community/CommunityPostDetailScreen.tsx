import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityPostDetail'>;

const BLUE = '#5D9BEA';
const BG = '#F3F4F6';

export default function CommunityPostDetailScreen({ navigation, route }: Props) {
  const { post } = route.params;
  const [comment, setComment] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Text style={styles.leftBack}>{'‹'}</Text>
  </TouchableOpacity>

  <View style={styles.headerRight}>
    <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
      <Image
        source={require('../../assets/home/icon_bell_red.png')}
        style={styles.bellIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  </View>
</View>

        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="검색어를 입력해 주세요."
              placeholderTextColor="#7D7D7D"
              style={styles.input}
            />

            <Image
              source={require('../../assets/home/icon_look.png')}
              style={styles.searchIconImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailCard}>
            <View style={styles.topRow}>
              <Text style={styles.boardLabel}>{post.boardLabel}</Text>
              <Text style={styles.timeText}>방금</Text>
            </View>

            <View style={styles.authorRow}>
              <Image
                source={require('../../assets/home/mediq_mascot.png')}
                style={styles.avatar}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.authorName}>아포용가리</Text>
                <Text style={styles.authorDate}>2025.11.17 18:01</Text>
              </View>
            </View>

            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.bodyText}>
              요 며칠 발목이 후끈후끈하게 아파서 정형외과를 가야 하는지 재활의학과를 가야 하는지 너무 헷갈렸어요.{'\n\n'}
              그러다가 앱에서 AI로 증상 분석해주는 기능이 있다고 해서 “발목이 후끈후끈해요”라고 입력해봤는데,
              염좌 동반된 염좌 가능성이 높다고 정형외과/재활의학과를 추천해주더라고요.{'\n\n'}
              덕분에 병원 선택하는 데 훨씬 도움이 됐어요.{'\n'}
              혹시 저처럼 고민되시는 분들, 한번 사용해보세요!
            </Text>

            <View style={styles.statRow}>
              <Text style={styles.eyeStat}>◉ 확인32</Text>
              <Text style={styles.heartStat}>♡ 공감2</Text>
              <Text style={styles.commentStat}>댓글4</Text>
            </View>

            <View style={styles.hospitalCard}>
              <View style={styles.hospitalTextWrap}>
                <Text style={styles.hospitalName}>JM가정의학과{'\n'}센텀시티점</Text>
                <Text style={styles.doctorName}>정재민 대표원장</Text>
              </View>

              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400' }}
                style={styles.doctorImage}
              />
            </View>

            <View style={styles.commentBlock}>
              <View style={styles.commentHeader}>
                <View>
                  <Text style={styles.commentAuthor}>엄망망</Text>
                  <Text style={styles.commentDate}>2025.11.17 18:01</Text>
                </View>

                <View style={styles.commentActionPill}>
                  <Text style={styles.commentActionIcon}>💬</Text>
                  <Text style={styles.commentActionDivider}>|</Text>
                  <Text style={styles.commentActionIcon}>♡</Text>
                  <Text style={styles.commentActionDivider}>|</Text>
                  <Text style={styles.commentActionIcon}>⋮</Text>
                </View>
              </View>

              <Text style={styles.commentText}>
                오대박 ㅋㅋㅋ 저도 같은경험했습니다... 역시 좋네요
              </Text>

              <View style={styles.replyWrap}>
                <Text style={styles.replyArrow}>↳</Text>
                <View style={styles.replyBox}>
                  <View style={styles.replyHeader}>
                    <Text style={styles.replyAuthor}>아야야</Text>
                    <Text style={styles.replyDate}>2025.11.17 18:01</Text>
                    <View style={styles.replyActionPill}>
                      <Text style={styles.commentActionIcon}>♡</Text>
                      <Text style={styles.commentActionDivider}>|</Text>
                      <Text style={styles.commentActionIcon}>⋮</Text>
                    </View>
                  </View>
                  <Text style={styles.replyText}>저도요 정말 대박!!</Text>
                </View>
              </View>
            </View>

            <View style={styles.commentBlock}>
              <View style={styles.commentHeader}>
                <View>
                  <Text style={styles.commentAuthor}>엄망망</Text>
                  <Text style={styles.commentDate}>2025.11.17 18:01</Text>
                </View>

                <View style={styles.commentActionPill}>
                  <Text style={styles.commentActionIcon}>💬</Text>
                  <Text style={styles.commentActionDivider}>|</Text>
                  <Text style={styles.commentActionIcon}>♡</Text>
                  <Text style={styles.commentActionDivider}>|</Text>
                  <Text style={styles.commentActionIcon}>⋮</Text>
                </View>
              </View>

              <Text style={styles.commentText}>
                오대박 ㅋㅋㅋ 저도 같은경험했습니다... 역시 좋네요
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomInputWrap}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="댓글을 입력하세요"
            placeholderTextColor="#9A9A9A"
            style={styles.bottomInput}
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendText}>등록</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BLUE,
  },

  container: {
    flex: 1,
    backgroundColor: BG,
  },

  header: {
    height: 98,
    backgroundColor: BLUE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftBack: {
  fontSize: 30,
  color: '#FFFFFF',
  fontWeight: '300',
  marginTop: -2,
},

  bellIcon: {
    width: 35,
    height: 35,
    marginRight: 18,
  },

  searchWrap: {
    marginTop: -18,
    paddingHorizontal: 20,
  },

  searchBox: {
    height: 46,
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 7,
    elevation: 5,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },

  searchIconImage: {
    width: 21,
    height: 21,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  boardLabel: {
    fontSize: 13,
    color: '#7D7D7D',
    fontWeight: '600',
  },

  timeText: {
    fontSize: 12,
    color: '#9A9A9A',
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  avatar: {
    width: 38,
    height: 38,
    marginRight: 10,
  },

  authorName: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '800',
  },

  authorDate: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '600',
  },

  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 14,
  },

  bodyText: {
    fontSize: 13,
    lineHeight: 22,
    color: '#B5B5B5',
    fontWeight: '700',
    marginBottom: 18,
  },

  statRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  eyeStat: {
    color: '#5B9BF7',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 18,
  },

  heartStat: {
    color: '#F28B97',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 18,
  },

  commentStat: {
    color: '#999999',
    fontSize: 13,
    fontWeight: '700',
  },

  hospitalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },

  hospitalTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  hospitalName: {
    fontSize: 16,
    color: '#57B6A9',
    fontWeight: '900',
    lineHeight: 22,
    marginBottom: 10,
  },

  doctorName: {
    fontSize: 14,
    color: '#202020',
    fontWeight: '900',
  },

  doctorImage: {
    width: 120,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },

  commentBlock: {
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    paddingTop: 16,
    marginTop: 6,
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  commentAuthor: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '800',
  },

  commentDate: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '600',
    marginTop: 2,
  },

  commentActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  commentActionIcon: {
    fontSize: 11,
    color: '#8E8E8E',
  },

  commentActionDivider: {
    fontSize: 11,
    color: '#C2C2C2',
    marginHorizontal: 7,
  },

  commentText: {
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '700',
    marginTop: 10,
    lineHeight: 20,
  },

  replyWrap: {
    flexDirection: 'row',
    marginTop: 12,
  },

  replyArrow: {
    fontSize: 14,
    color: '#A6A6A6',
    marginRight: 8,
    marginTop: 8,
  },

  replyBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
  },

  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  replyAuthor: {
    fontSize: 13,
    color: '#222222',
    fontWeight: '800',
    marginRight: 8,
  },

  replyDate: {
    fontSize: 12,
    color: '#C0C0C0',
    fontWeight: '600',
    flex: 1,
  },

  replyActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  replyText: {
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '700',
    marginTop: 10,
  },

  bottomInputWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#333333',
  },

  sendBtn: {
    marginLeft: 8,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E9EDF5',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendText: {
    fontSize: 14,
    color: '#5577A3',
    fontWeight: '800',
  },
});