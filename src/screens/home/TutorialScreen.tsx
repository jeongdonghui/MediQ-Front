import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Tutorial'>;

const BLUE = '#5B83E8';
const BG = '#FFFFFF';
const HEADER_BG = '#F3F4F6';
const TEXT = '#222222';
const DOT = '#D7D9DE';

type TutorialPage = {
  type: 'intro' | 'image' | 'outro';
  image?: any;
  headerTitle?: string;
  title?: string;
  desc?: string;
  buttonText: string;
};

const pages: TutorialPage[] = [
  {
    type: 'intro',
    headerTitle: '',
    title: '환자의 언어를 의사의 언어로',
    desc: 'MediQ는 아픈 증상을\n의학 용어로 정리해주는 서비스입니다.',
    buttonText: '시작하기',
  },
  {
    type: 'image',
    image: require('../../assets/tutorial/tutorial_1_body.png'),
    headerTitle: '부위선택',
    title: '부위 선택 안내',
    desc: '아픈 신체 부위를 선택해주세요.\n직관적인 2D 인체 모델로\n쉽게 고를 수 있어요.',
    buttonText: '다음',
  },
  {
    type: 'image',
    image: require('../../assets/tutorial/tutorial_2_detail.png'),
    headerTitle: '세부 부위 선택',
    title: '증상 선택 안내',
    desc: '선택한 부위에 대해\n✔ 어떤 느낌인지\n✔ 얼마나 아픈지\n✔ 언제부터 아팠는지 등\n차례대로 선택해주세요.',
    buttonText: '다음',
  },
  {
    type: 'image',
    image: require('../../assets/tutorial/tutorial_3_symptom.png'),
    headerTitle: '증상 선택',
    title: '입력 방식 안내',
    desc: '직접 입력하지 않아도 괜찮아요.\n카드를 선택하는 것만으로\n증상을 표현할 수 있어요.',
    buttonText: '다음',
  },
  {
    type: 'image',
    image: require('../../assets/tutorial/tutorial_4_analysis.png'),
    headerTitle: 'AI 증상 분석',
    title: 'AI 분석 안내',
    desc: '입력한 증상을 바탕으로\nAI가 구체화 표현을\n표준 의학 용어로 분석합니다.',
    buttonText: '다음',
  },
  {
    type: 'image',
    image: require('../../assets/tutorial/tutorial_5_result.png'),
    headerTitle: '종합 분석 결과',
    title: '결과 확인',
    desc: '정리된 의학 용어와\n추천 진료과를\n한 눈에 확인할 수 있어요.',
    buttonText: '다음',
  },
  {
    type: 'image',
    image: require('../../assets/tutorial/tutorial_6_map.png'),
    headerTitle: '',
    title: '병원 연결 안내',
    desc: '원하신다면\n카카오맵을 통해\n주변 병원을 바로 확인할 수 있어요.',
    buttonText: '다음',
  },
  {
    type: 'outro',
    headerTitle: '',
    title: '이제 진단을 시작해보세요.\nMediQ가 함께할게요.',
    buttonText: '진단 시작하기',
  },
];

function StepDots({ current }: { current: number }) {
  return (
    <View style={styles.dotsWrap}>
      {pages.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, current === index && styles.dotActive]}
        />
      ))}
    </View>
  );
}

export default function TutorialScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const page = useMemo(() => pages[step], [step]);

  const handlePrev = () => {
    if (step === 0) {
      navigation.navigate('Home');
      return;
    }
    setStep((prev) => prev - 1);
  };

  const handleNext = () => {
    if (step === pages.length - 1) {
      navigation.replace('BodySelect');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const renderMainContent = () => {
    if (page.type === 'intro') {
      return (
        <View style={styles.introWrap}>
          <Image
            source={require('../../assets/image/mediq_character.png')}
            style={styles.introCharacter}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/image/logo_mediqC.png')}
            style={styles.introLogo}
            resizeMode="contain"
          />
          <Text style={styles.introTitle}>{page.title}</Text>
          <Text style={styles.introDesc}>{page.desc}</Text>
        </View>
      );
    }

    if (page.type === 'outro') {
      return (
        <View style={styles.outroWrap}>
          <Image
            source={require('../../assets/image/logo_mediqC.png')}
            style={styles.outroLogo}
            resizeMode="contain"
          />
          <Text style={styles.outroTitle}>{page.title}</Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.imageWrap}>
          <Image
            source={page.image}
            style={styles.tutorialImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.guideTitle}>{page.title}</Text>
          <Text style={styles.guideDesc}>{page.desc}</Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePrev} style={styles.headerSide}>
            <Text style={styles.headerBack}>{'‹'}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{page.headerTitle ?? ''}</Text>

          <View style={styles.headerSide} />
        </View>

        <View style={styles.content}>{renderMainContent()}</View>

        <StepDots current={step} />

        <TouchableOpacity style={styles.bottomButton} onPress={handleNext}>
          <Text style={styles.bottomButtonText}>{page.buttonText}</Text>
        </TouchableOpacity>
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

  header: {
    height: 50,
    backgroundColor: HEADER_BG,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEEF2',
  },
  headerSide: {
    width: 44,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBack: {
    fontSize: 24,
    color: TEXT,
    fontWeight: '500',
    lineHeight: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: TEXT,
    fontWeight: '800',
  },

  content: {
    flex: 1,
    backgroundColor: BG,
  },

  imageWrap: {
    height: 450,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  tutorialImage: {
    width: '100%',
    height: '100%',
  },

  textBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  guideTitle: {
    fontSize: 18,
    color: BLUE,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  guideDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5F6368',
    fontWeight: '600',
    textAlign: 'center',
  },

  introWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 14,
  },
  introCharacter: {
    width: 72,
    height: 72,
    marginBottom: 10,
  },
  introLogo: {
    width: 150,
    height: 56,
    marginBottom: 18,
  },
  introTitle: {
    fontSize: 18,
    lineHeight: 26,
    color: BLUE,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  introDesc: {
    fontSize: 13,
    lineHeight: 21,
    color: '#9BA1A8',
    textAlign: 'center',
    fontWeight: '600',
  },

  outroWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 14,
  },
  outroLogo: {
    width: 150,
    height: 56,
    marginBottom: 24,
  },
  outroTitle: {
    fontSize: 18,
    lineHeight: 28,
    color: BLUE,
    fontWeight: '900',
    textAlign: 'center',
  },

  dotsWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    gap: 5,
    backgroundColor: BG,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DOT,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BLUE,
  },

  bottomButton: {
    height: 56,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});