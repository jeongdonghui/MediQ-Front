import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DetailCategory'>;

function DetailQuestionScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>세부 질문</Text>

        <Text style={styles.text}>
          선택한 부위에 대해 추가적인 질문이 표시되는 화면입니다.
        </Text>

        <Text style={styles.text}>
          이 화면에서는 증상 관련 질문을 단계적으로 진행합니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default DetailQuestionScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 10,
  },
});