import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DecisionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>어떻게 도와드릴까요?</Text>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Chat')}>
        <Text style={styles.optionText}>증상 더 자세히 말하기 (챗봇)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => alert('지도 연동은 추후 구현합니다!')}>
        <Text style={styles.optionText}>가까운 진료과 보기</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:20},
  title:{fontSize:26,fontWeight:'700',marginBottom:30},
  option:{padding:20,backgroundColor:'#f1f1f1',borderRadius:12,marginBottom:15},
  optionText:{fontSize:16},
});
