import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SymptomSelect'>;

type SymptomItem = { key: string; label: string };

export default function SymptomSelectScreen({ navigation, route }: Props) {
  const { area, category, location } = route.params;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherText, setOtherText] = useState('');

  const { headerTitle, headerDesc, items } = useMemo(() => {
    // ===================== 머리(두부) =====================
    if (location === '두부') {
      return {
        headerTitle: '머리(두부) 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '머리가 찌르는 듯이 아파요', label: '머리가 찌르는 듯이 아파요' },
          { key: '머리가 뻐해요', label: '머리가 뻐해요' },
          { key: '관자놀이가 지끈거려요', label: '관자놀이가 지끈거려요' },
          { key: '머리가 통증을 눌러요', label: '머리가 통증을 눌러요' },
          { key: '뒷골이 뻐빳하고 당겨요', label: '뒷골이 뻐빳하고 당겨요' },
        ] as SymptomItem[],
      };
    }

    // ===================== 얼굴 - 안면부 =====================
    if (location === '안면부') {
      return {
        headerTitle: '얼굴(안면부) 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '입 벌리기가 힘들어요', label: '입 벌리기가 힘들어요' },
          { key: '관자대가 얼얼하고 아파요', label: '관자대가 얼얼하고 아파요' },
          { key: '얼굴 쪽이 뻐해요', label: '얼굴 쪽이 뻐해요' },
          { key: '턱에 딱딱 소리가 나요', label: '턱에 딱딱 소리가 나요' },
          { key: '미간이 지끈거리고 답답해요', label: '미간이 지끈거리고 답답해요' },
        ],
      };
    }

    // ===================== 얼굴 - 안구 =====================
    if (location === '안구') {
      return {
        headerTitle: '얼굴(안구) 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '눈앞이 뿌옇게 같아요', label: '눈앞이 뿌옇게 같아요' },
          { key: '눈이 빨개지고 부었어요', label: '눈이 빨개지고 부었어요' },
          { key: '눈이 침침해요', label: '눈이 침침해요' },
          { key: '눈꺼풀이 파르르 떨려요', label: '눈꺼풀이 파르르 떨려요' },
          { key: '눈이 시리고 따가워요', label: '눈이 시리고 따가워요' },
        ],
      };
    }

    // ===================== 얼굴 - 구강 및 인후 =====================
    if (location === '구강 및 인후') {
      return {
        headerTitle: '얼굴(구강 및 인후) 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '이가 시리고 아파요', label: '이가 시리고 아파요' },
          { key: '잇몸이 붓고 피나요', label: '잇몸이 붓고 피나요' },
          { key: '입 안이 다 헐었어요', label: '입 안이 다 헐었어요' },
          { key: '코가 막혀요', label: '코가 막혀요' },
          { key: '가래가 자꾸 생겨요', label: '가래가 자꾸 생겨요' },
        ],
      };
    }

    // ===================== 얼굴 - 귀 =====================
    if (location === '귀') {
      return {
        headerTitle: '얼굴(귀) 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '귀가 멍하고 먹먹해요', label: '귀가 멍하고 먹먹해요' },
          { key: '귀에서 웅웅하는 소리가 들려요', label: '귀에서 웅웅하는 소리가 들려요' },
          { key: '귀 안이 욱신거려요', label: '귀 안이 욱신거려요' },
          { key: '귀 안이 가려워요', label: '귀 안이 가려워요' },
          { key: '귀가 찌릿찌릿해서 아파요', label: '귀가 찌릿찌릿해서 아파요' },
        ],
      };
    }

    // ===================== 목 =====================
    if (location === '목 안') {
      return {
        headerTitle: '목 안 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '침 삼킬 때마다 아파요', label: '침 삼킬 때마다 아파요' },
          { key: '목이 따끔따끔 거려요', label: '목이 따끔따끔 거려요' },
          { key: '목에 이물감이 느껴져요', label: '목에 이물감이 느껴져요' },
          { key: '목소리가 쉬었어요', label: '목소리가 쉬었어요' },
          { key: '목이 칼칼해요', label: '목이 칼칼해요' },
        ],
      };
    }
    if (location === '목 앞/옆 쪽') {
      return {
        headerTitle: '목 앞/옆 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '목이 통통 부었어요', label: '목이 통통 부었어요' },
          { key: '목에 통증 감각이 퍼져요', label: '목에 통증 감각이 퍼져요' },
          { key: '목이 뻐근한 느낌이에요', label: '목이 뻐근한 느낌이에요' },
          { key: '목 압박이 당겨요', label: '목 압박이 당겨요' },
          { key: '목이 뻣뻣해요', label: '목이 뻣뻣해요' },
        ],
      };
    }
    if (location === '뒷 목') {
      return {
        headerTitle: '뒷 목 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '목이 뻐근해요', label: '목이 뻐근해요' },
          { key: '고개가 안 돌아가요', label: '고개가 안 돌아가요' },
          { key: '목이 뭉쳤어요', label: '목이 뭉쳤어요' },
          { key: '목이 뻣뻣해요', label: '목이 뻣뻣해요' },
          { key: '목이 찌릿찌릿해요', label: '목이 찌릿찌릿해요' },
        ],
      };
    }

    // ===================== 가슴 =====================
    if (location === '가슴 중앙') {
      return {
        headerTitle: '가슴(가슴 중앙) 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '가슴이 답답해요', label: '가슴이 답답해요' },
          { key: '가슴이 타들어가듯 아파요', label: '가슴이 타들어가듯 아파요' },
          { key: '가슴이 쑤셔요', label: '가슴이 쑤셔요' },
          { key: '가슴이 뜨끔해요', label: '가슴이 뜨끔해요' },
          { key: '심장 박동이 비정상적인 것 같아요', label: '심장 박동이 비정상적인 것 같아요' },
        ],
      };
    }

    if (location === '좌우 흉부') {
      return {
        headerTitle: '가슴(좌우 흉부) 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '가슴이 콕콕 쑤셔요', label: '가슴이 콕콕 쑤셔요' },
          { key: '숨 쉴 때마다 답답해요', label: '숨 쉴 때마다 답답해요' },
          { key: '갈비뼈가 쑤셔요', label: '갈비뼈가 쑤셔요' },
          { key: '숨 쉬면 아파서 찌릿해요', label: '숨 쉬면 아파서 찌릿해요' },
          { key: '숨 쉬는 게 힘들어요', label: '숨 쉬는 게 힘들어요' },
        ],
      };
    }

    if (location === '유방') {
      return {
        headerTitle: '가슴(유방) 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '피부 및 젖꼭지요', label: '피부 및 젖꼭지요' },
          { key: '멍울이 잡혀요', label: '멍울이 잡혀요' },
          { key: '묵직해요', label: '묵직해요' },
          { key: '유두가 따끔거려요', label: '유두가 따끔거려요' },
          { key: '가슴이 붓고 아파요', label: '가슴이 붓고 아파요' },
        ],
      };
    }

    // ===================== 명치 =====================
    if (location === '명치 중심') {
      return {
        headerTitle: '명치(명치중심) 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '명치가 쥐어짜는 듯 답답해요', label: '명치가 쥐어짜는 듯 답답해요' },
          { key: '속이 찌릿거리고 쓰려요', label: '속이 찌릿거리고 쓰려요' },
          { key: '헛배가 부른 것 같아요', label: '헛배가 부른 것 같아요' },
          { key: '체한 것 같아요', label: '체한 것 같아요' },
          { key: '메스꺼워요', label: '메스꺼워요' },
        ],
      };
    }

    // ===================== 명치 =====================
    if (location === '우상복부') {
      return {
        headerTitle: '우상복부 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '묵직해요', label: '묵직해요' },
          { key: '콕콕쑤셔요', label: '콕콕쑤셔요' },
          { key: '쥐어짜듯 아파요', label: '쥐어짜듯 아파요' },
          { key: '결려요', label: '결려요' },
        ],
      };
    }

    if (location === '좌상복부') {
      return {
        headerTitle: '좌상복부 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '묵직해요', label: '묵직해요' },
          { key: '콕콕쑤셔요', label: '콕콕쑤셔요' },
          { key: '쥐어짜듯 아파요', label: '쥐어짜듯 아파요' },
          { key: '결려요', label: '결려요' },
        ],
      };
    }

    if (location === '상복부 중앙') {
      return {
        headerTitle: '상복부 중앙 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '속이 답답해요', label: '속이 답답해요' },
          { key: '속이 울렁거려요', label: '속이 울렁거려요' },
          { key: '메스꺼워요', label: '메스꺼워요' },
          { key: '속이 쓰려요', label: '속이 쓰려요' },
          { key: '더부룩해요', label: '더부룩해요' },
        ],
      };
    }

    if (location === '배꼽주변') {
      return {
        headerTitle: '배꼽주변 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '살살 아파요', label: '살살 아파요' },
          { key: '불편하고 답답해요', label: '불편하고 답답해요' },
          { key: '배꼽이 콕콕쑤셔요', label: '배꼽이 콕콕쑤셔요' },
          { key: '뒤틀리는 느낌이 들어요', label: '뒤틀리는 느낌이 들어요' },
          { key: '끊어질 거 같아요', label: '끊어질 거 같아요' },
        ],
      };
    }

    if (location === '옆구리') {
      return {
        headerTitle: '옆구리 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '결려요', label: '결려요' },
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '칼로 찌르듯 아파요', label: '칼로 찌르듯 아파요' },
          { key: '당겨요', label: '당겨요' },
          { key: '시려요', label: '시려요' },
        ],
      };
    }

    if (location === '우하복부') {
      return {
        headerTitle: '우하복부 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '묵직해요', label: '묵직해요' },
          { key: '콕콕 쑤셔요', label: '콕콕 쑤셔요' },
          { key: '쥐어짜듯 아파요', label: '어짜듯 아파요' },
          { key: '결려요', label: '결려요' },
        ],
      };
    }

    if (location === '좌하복부') {
      return {
        headerTitle: '좌하복부 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '묵직해요', label: '묵직해요' },
          { key: '콕콕 쑤셔요', label: '콕콕 쑤셔요' },
          { key: '쥐어짜듯 아파요', label: '어짜듯 아파요' },
          { key: '결려요', label: '결려요' },
        ],
      };
    }

    if (location === '하복부 중앙') {
      return {
        headerTitle: '하복부 중앙 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '묵직해요', label: '묵직해요' },
          { key: '콕콕 쑤셔요', label: '콕콕 쑤셔요' },
          { key: '쥐어짜듯 아파요', label: '어짜듯 아파요' },
          { key: '결려요', label: '결려요' },
        ],
      };
    }

    if (location === '골반뼈 부근') {
      return {
        headerTitle: '골반뼈 부근 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '시려요', label: '시려요' },
          { key: '으스러질듯이 아파요', label: '으스러질듯이 아파요' },
          { key: '뻐근해요', label: '뻐근해요' },
          { key: '골반이 빠질 거 같아요', label: '골반이 빠질 거 같아요' },
          { key: '골반이 틀어진 거 같아요', label: '골반이 틀어진 거 같아요' },
        ],
      };
    }

    if (location === '사타구니') {
      return {
        headerTitle: '사타구니 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '당겨요', label: '당겨요' },
          { key: '콕콕 쑤셔요', label: '콕콕 쑤셔요' },
          { key: '멍울이 잡혀요', label: '멍울이 잡혀요' },
          { key: '움직일 때마다 아파요', label: '움직일 때마다 아파요' },
          { key: '욱신거려요', label: '욱신거려요' },
        ],
      };
    }

    if (location === '생식기') {
      return {
        headerTitle: '생식기 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '가려워요', label: '가려워요' },
          { key: '따갑고 화끈거려요', label: '따갑고 화끈거려요' },
          { key: '이상한 분비물이 나와요', label: '이상한 분비물이 나와요' },
          { key: '물집이나 뾰루지가 났어요', label: '물집이나 뾰루지가 났어요' },
          { key: '붓고 아파요', label: '붓고 아파요' },
        ],
      };
    }

    if (location === '항문') {
      return {
        headerTitle: '항문 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '쓰라려요', label: '쓰라려요' },
          { key: '피가 나요', label: '피가 나요' },
          { key: '뭐가 튀어나왔어요', label: '뭐가 튀어나왔어요' },
          { key: '가렵고 따가워요', label: '가렵고 따가워요' },
          { key: '욱신거려요', label: '욱신거려요' },
        ],
      };
    }

    //팔다리
    if (location === '어깨') {
      return {
        headerTitle: '어깨 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '걸리고 뻐근해요', label: '걸리고 뻐근해요' },
          { key: '무거워요', label: '무거워요' },
          { key: '콕콕 쑤셔요', label: '콕콕 쑤셔요' },
          { key: '빠질 거 같아요', label: '빠질 거 같아요' },
          { key: '팔 들기가 힘들어요', label: '팔 들기가 힘들어요' },
        ],
      };
    }

    if (location === '심팔 및 팔꿈치') {
      return {
        headerTitle: '심팔 및 팔꿈치 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '시려요', label: '시려요' },
          { key: '아려요', label: '아려요' },
          { key: '땡기고 뻐근해요', label: '땡기고 뻐근해요' },
          { key: '묵직하고 아파요', label: '묵직하고 아파요' },
          { key: '굽히고 펴기 힘들어요', label: '굽히고 펴기 힘들어요' },
        ],
      };
    }

    if (location === '아랫팔 및 손목') {
      return {
        headerTitle: '아랫팔 및 손목 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '시려요', label: '시려요' },
          { key: '팔뚝이 저리고 아파요', label: '팔뚝이 저리고 아파요' },
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '힘이 잘 안들어가요', label: '힘이 잘 안들어가요' },
          { key: '돌리기 힘들어요', label: '돌리기 힘들어요' },
        ],
      };
    }

    if (location === '손') {
      return {
        headerTitle: '손 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '손가락 끝이 저려요', label: '손가락 끝이 저려요' },
          { key: '남의 살 같아요', label: '남의 살 같아요' },
          { key: '주먹이 잘 안쥐어져요', label: '주먹이 잘 안쥐어져요' },
          { key: '마디가 욱신거려요', label: '마디가 욱신거려요' },
          { key: '퉁퉁 부엇어요', label: '퉁퉁 부엇어요' },
        ],
      };
    }

    if (location === '허벅지 및 고관절') {
      return {
        headerTitle: '허벅지 및 고관절 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '뻐근해요', label: '뻐근해요' },
          { key: '덜그럭거려요', label: '덜그럭거려요' },
          { key: '찌릿하고 아파요', label: '찌릿하고 아파요' },
          { key: '터질 듯이 아파요', label: '터질 듯이 아파요' },
          { key: '저리고 당겨요', label: '저리고 당겨요' },
        ],
      };
    }

    if (location === '무릎') {
      return {
        headerTitle: '무릎 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '시려요', label: '시려요' },
          { key: '잘 안굽혀져요', label: '잘 안굽혀져요' },
          { key: '뻐근하고 아파요', label: '뻐근하고 아파요' },
          { key: '무릎이 붓고 열감이 있어요', label: '무릎이 붓고 열감이 있어요' },
          { key: '불안정해요', label: '불안정해요' },
        ],
      };
    }

    if (location === '종아리 및 발목') {
      return {
        headerTitle: '종아리 및 발목 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '자주 저려요', label: '자주 저려요' },
          { key: '부었어요', label: '부었어요' },
          { key: '종아리가 묵직해요', label: '종아리가 묵직해요' },
          { key: '종아리가 땡겨요', label: '종아리가 땡겨요' },
          { key: '발목이 시려요', label: '발목이 시려요' },
        ],
      };
    }

    if (location === '발') {
      return {
        headerTitle: '발 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '발바닥이 찌릿해요', label: '발바닥이 찌릿해요' },
          { key: '뻐근하고 아파요', label: '뻐근하고 아파요' },
          { key: '퉁퉁 부었어요', label: '퉁퉁 부었어요' },
          { key: '자주 저려요', label: '자주 저려요' },
          { key: '뜨거워요', label: '뜨거워요' },
        ],
      };
    }

    //전신 기타
    if (location === '피부표현') {
      return {
        headerTitle: '피부표현 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '오돌토돌 뭐가 났어요', label: '오돌토돌 뭐가 났어요' },
          { key: '따끔따끔 거려요', label: '따끔따끔 거려요' },
          { key: '화끈거려요', label: '화끈거려요' },
          { key: '피부가 땡겨요', label: '피부가 땡겨요' },
          { key: '가려워요', label: '가려워요' },
        ],
      };
    }

    if (location === '피부하층 및 부종') {
      return {
        headerTitle: '피부하층 및 부종 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '퉁퉁 부었어요', label: '퉁퉁 부었어요' },
          { key: '딱딱한게 만져져요', label: '딱딱한게 만져져요' },
          { key: '시퍼렇게 멍들었어요', label: '시퍼렇게 멍들었어요' },
          { key: '몽우리가 잡혀요', label: '몽우리가 잡혀요' },
          { key: '살이 터질 거 같아요', label: '살이 터질 거 같아요' },
        ],
      };
    }

    if (location === '감각이상') {
      return {
        headerTitle: '감각이상 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '찌릿찌릿거렬요', label: '찌릿찌릿거렬요' },
          { key: '남의 살 같아요', label: '남의 살 같아요' },
          { key: '전기가 통하듯 저릿저릿 아파요', label: '전기가 통하듯 저릿저릿 아파요' },
          { key: '감각이 둔해요', label: '감각이 둔해요' },
          { key: '스치가만 해도 아파요', label: '스치가만 해도 아파요' },
        ],
      };
    }

    if (location === '조절기능') {
      return {
        headerTitle: '조절기능 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '덜덜 떨려요', label: '덜덜 떨려요' },
          { key: '세상이 빙빙 돌아요', label: '세상이 빙빙 돌아요' },
          { key: '중심을 못 잡겠어요', label: '중심을 못 잡겠어요' },
          { key: '머리가 갑자기 핑 돌아요', label: '머리가 갑자기 핑 돌아요' },
          { key: '몸이 내 마음대로 안움직여요', label: '몸이 내 마음대로 안움직여요' },
        ],
      };
    }

    if (location === '통증 및 컨디션') {
      return {
        headerTitle: '통증 및 컨디션 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '뼈마다 쑤셔요', label: '뼈마다 쑤셔요' },
          { key: '으슬으슬 오한이 나요', label: '으슬으슬 오한이 나요' },
          { key: '몸이 불덩이 같아요', label: '몸이 불덩이 같아요' },
          { key: '두들겨 맞은 듯 몸이 아파요', label: '두들겨 맞은 듯 몸이 아파요' },
          { key: '살이 아파요', label: '살이 아파요' },
        ],
      };
    }

    if (location === '순환 및 대사') {
      return {
        headerTitle: '순환 및 대사 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '식은 땀이 줄줄 흘러요', label: '덜덜 떨려요' },
          { key: '목이 타들어가요', label: '세상이 빙빙 돌아요' },
          { key: '입이 자꾸 말라요', label: '중심을 못 잡겠어요' },
          { key: '기운이 하나도 없어요', label: '머리가 갑자기 핑 돌아요' },
          { key: '몸이 축 늘어져요', label: '몸이 내 마음대로 안움직여요' },
        ],
      };
    }

     if (location === '등') {
      return {
        headerTitle: '등 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '날개뼈 사이가 결려요', label: '날개뼈 사이가 결려요' },
          { key: '담 걸린 듯이 뻐근해요', label: '담 걸린 듯이 뻐근해요' },
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '차갑고 시려요', label: '차갑고 시려요' },
          { key: '자주 가려워요', label: '자주 가려워요' },
        ],
      };
    }

     if (location === '허리') {
      return {
        headerTitle: '허리 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '시려요', label: '시려요' },
          { key: '뻐근해요', label: '뻐근해요' },
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '끊어질 듯이 아파요', label: '끊어질 듯이 아파요' },
          { key: '아파서 펴질 못하겠어요', label: '아파서 펴질 못하겠어요' },
        ],
      };
    }

     if (location === '꼬리뼈') {
      return {
        headerTitle: '꼬리뼈 쪽이 어떻게 아프신가요?',
        headerDesc: '모두 선택해주세요.',
        items: [
          { key: '앉을 때 마다 아파요', label: '앉을 때 마다 아파요' },
          { key: '욱신거려요', label: '욱신거려요' },
          { key: '찌릿찌릿해요', label: '찌릿찌릿해요' },
          { key: '콕콕 쑤셔요', label: '콕콕 쑤셔요' },
          { key: '닿으면 아파요', label: '닿으면 아파요' },
        ],
      };
    }

    
    

    



    return {
      headerTitle: `${location} 쪽이 어떻게 아프신가요?`,
      headerDesc: '모두 선택해주세요.',
      items: [] as SymptomItem[],
    };
  }, [location]);

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const canSubmit = selected.size > 0 || otherText.trim().length > 0;

  const onDone = () => {
  if (!canSubmit) return;

  navigation.navigate('PainScope', {
    area,
    category,
    location,
    symptoms: Array.from(selected),
    otherText: otherText.trim() ? otherText.trim() : undefined,
  });
};

  const Card = ({ item }: { item: SymptomItem }) => {
    const active = selected.has(item.key);
    return (
      <Pressable
        onPress={() => toggle(item.key)}
        style={({ pressed }) => [
          styles.cardItem,
          active && styles.cardItemActive,
          pressed && { opacity: 0.97 },
        ]}
      >
        <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>{item.label}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
            <Text style={styles.backTxt}>{'‹'}</Text>
          </Pressable>
          <Text style={styles.topTitle}>증상 선택</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.header}>
          <Text style={styles.h1}>{headerTitle}</Text>
          <Text style={styles.h2}>{headerDesc}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.listWrap}>
            {items.map((it) => (
              <Card key={it.key} item={it} />
            ))}

            {/* ✅ 기타: 누르면 입력칸 펼쳐짐 */}
            <Pressable
              onPress={() => setOtherOpen((v) => !v)}
              style={({ pressed }) => [
                styles.otherBtn,
                pressed && { opacity: 0.97 },
                otherOpen && styles.otherBtnActive,
              ]}
            >
              <Text style={[styles.otherBtnText, otherOpen && styles.otherBtnTextActive]}>기타</Text>
              <Text style={styles.otherHint}>ex) 지끈지끈 아파요...</Text>
            </Pressable>

            {otherOpen && (
              <View style={styles.otherInputWrap}>
                <TextInput
                  value={otherText}
                  onChangeText={setOtherText}
                  placeholder="기타 증상을 입력해주세요"
                  placeholderTextColor="#B6BEC9"
                  style={styles.otherInput}
                  multiline
                />
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomArea}>
          <Pressable
            onPress={onDone}
            disabled={!canSubmit}
            style={[styles.doneBtn, canSubmit ? styles.doneBtnEnabled : styles.doneBtnDisabled]}
          >
            <Text style={[styles.doneTxt, canSubmit ? styles.doneTxtEnabled : styles.doneTxtDisabled]}>
              선택 완료
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const BLUE = '#3B82F6';
const BG = '#F3F8FF';
const CARD_BG = '#FFFFFF';
const SELECT_BG = '#DCEBFF';
const BORDER = '#E6EEF8';
const SHADOW = '#000000';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backTxt: { fontSize: 28, color: '#111827', lineHeight: 30 },
  topTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },

  header: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 10 },
  h1: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 4 },
  h2: { fontSize: 12, color: '#6B7280' },

  scrollContent: { paddingBottom: 10 },
  listWrap: { paddingHorizontal: 18, gap: 12 },

  cardItem: {
    backgroundColor: CARD_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SHADOW,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardItemActive: {
    backgroundColor: SELECT_BG,
    borderColor: BLUE,
    shadowOpacity: 0.12,
    elevation: 3,
  },
  cardTitle: { fontSize: 12.5, fontWeight: '800', color: BLUE, textAlign: 'center' },
  cardTitleActive: { color: BLUE },

  // 기타 버튼
  otherBtn: {
    backgroundColor: CARD_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SHADOW,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  otherBtnActive: {
    backgroundColor: SELECT_BG,
    borderColor: BLUE,
  },
  otherBtnText: { fontSize: 12.5, fontWeight: '900', color: BLUE, marginBottom: 4 },
  otherBtnTextActive: { color: BLUE },
  otherHint: { fontSize: 11, color: '#B6BEC9' },

  otherInputWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
  },
  otherInput: {
    minHeight: 54,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F8FAFF',
    color: '#111827',
    fontSize: 12,
  },

  bottomArea: { paddingHorizontal: 18, paddingBottom: 18, paddingTop: 10 },
  doneBtn: { height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  doneBtnEnabled: { backgroundColor: BLUE },
  doneBtnDisabled: { backgroundColor: '#E5E7EB' },

  doneTxt: { fontSize: 13, fontWeight: '800' },
  doneTxtEnabled: { color: '#FFFFFF' },
  doneTxtDisabled: { color: '#9CA3AF' },
});