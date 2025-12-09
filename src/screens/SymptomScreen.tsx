import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDiagnosis } from '../state/diagnosis';

export default function SymptomScreen({ navigation }) {
  const { bodyPart, symptom, setSymptom } = useDiagnosis();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bodyPart}이(가) 어떻게 아픈가요?</Text>
      <TextInput
        style={styles.input}
        placeholder="예: 욱신거려요, 찌릿해요..."
        value={symptom}
        onChangeText={setSymptom}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Decision')}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:20},
  title:{fontSize:22,fontWeight:'600',marginBottom:20},
  input:{padding:15,borderWidth:1,borderRadius:10,borderColor:'#ccc',marginBottom:20},
  button:{padding:15,backgroundColor:'#3498db',borderRadius:12,alignItems:'center'},
  buttonText:{color:'#fff',fontSize:16,fontWeight:'600'},
});
