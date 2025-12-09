import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDiagnosis } from '../state/diagnosis';

export default function BodyPickScreen({ navigation }) {
  const { setBodyPart } = useDiagnosis();
  const bodyParts = ['머리', '목', '가슴', '배', '다리', '팔'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>어디가 아프신가요?</Text>
      {bodyParts.map((part) => (
        <TouchableOpacity
          key={part}
          style={styles.option}
          onPress={() => { setBodyPart(part); navigation.navigate('Symptom'); }}
        >
          <Text style={styles.optionText}>{part}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:20},
  title:{fontSize:24,fontWeight:'bold',marginBottom:20},
  option:{padding:15,marginBottom:10,backgroundColor:'#f1f1f1',borderRadius:10},
  optionText:{fontSize:16},
});
