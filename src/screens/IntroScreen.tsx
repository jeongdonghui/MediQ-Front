import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function IntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>안녕하세요!</Text>
      <Text style={styles.subtitle}>진단을 시작해볼까요?</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BodyPick')}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center',padding:20},
  title:{fontSize:30,fontWeight:'bold'},
  subtitle:{fontSize:16,marginTop:10,color:'#555'},
  button:{marginTop:40,paddingVertical:15,paddingHorizontal:50,backgroundColor:'#3498db',borderRadius:12},
  buttonText:{color:'#fff',fontSize:16,fontWeight:'600'},
});
