import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useDiagnosis } from '../state/diagnosis';

export default function ChatScreen() {
  const { bodyPart, symptom } = useDiagnosis();
  const [messages, setMessages] = useState([{ from: 'bot', text: `${bodyPart}가 '${symptom}' 하다고 하셨군요.` }]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'me', text: input }]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatBox}>
        {messages.map((m, i) => (
          <Text key={i} style={m.from === 'me' ? styles.my : styles.bot}>{m.text}</Text>
        ))}
      </ScrollView>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="메시지를 입력하세요..." value={input} onChangeText={setInput} />
        <TouchableOpacity style={styles.send} onPress={send}><Text style={{color:'#fff'}}>전송</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,padding:15},
  chatBox:{flex:1,marginBottom:15},
  bot:{padding:10,backgroundColor:'#eee',marginBottom:10,borderRadius:8},
  my:{padding:10,backgroundColor:'#3498db',color:'#fff',marginBottom:10,borderRadius:8,alignSelf:'flex-end'},
  row:{flexDirection:'row',alignItems:'center'},
  input:{flex:1,padding:10,borderWidth:1,borderRadius:8,marginRight:10},
  send:{padding:10,backgroundColor:'#3498db',borderRadius:8},
});
