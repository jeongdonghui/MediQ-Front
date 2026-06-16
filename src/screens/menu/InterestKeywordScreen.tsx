import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { getMySettings, updateMySettings } from '../../api/users';

type Props = NativeStackScreenProps<RootStackParamList, 'InterestKeyword'>;

export default function InterestKeywordScreen({ navigation }: Props) {
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getMySettings();
      if (data && data.keywords) {
        setKeywords(data.keywords);
      }
    } catch (e) {
      console.warn('Failed to load settings', e);
    }
  };

  const syncKeywords = async (newKeywords: string[]) => {
    try {
      await updateMySettings({ keywords: newKeywords });
    } catch (e) {
      console.warn('Failed to sync keywords', e);
    }
  };

  const handleAddKeyword = () => {
    const value = keyword.trim();

    if (!value) {
      return;
    }

    if (keywords.length >= 5) {
      Alert.alert('안내', '키워드는 최대 5개까지 등록할 수 있습니다.');
      return;
    }

    if (keywords.includes(value)) {
      Alert.alert('안내', '이미 등록된 키워드입니다.');
      return;
    }

    const updated = [...keywords, value];
    setKeywords(updated);
    syncKeywords(updated);
    setKeyword('');
  };

  const handleRemoveKeyword = (target: string) => {
    Alert.alert(
      '삭제',
      `'${target}' 키워드를 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
             const updated = keywords.filter((item) => item !== target);
             setKeywords(updated);
             syncKeywords(updated);
          },
        },
      ]
    );
  };

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

        <Text style={styles.title}>관심 키워드</Text>

        <View style={styles.sideBtn} />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="알림 받을 키워드 입력"
          value={keyword}
          onChangeText={setKeyword}
          maxLength={20}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddKeyword}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.count}>총 {keywords.length}/5</Text>

      {keywords.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>아직 등록된 키워드가 없습니다.</Text>
        </View>
      ) : (
        <View style={styles.listWrap}>
          {keywords.map((item) => (
            <View key={item} style={styles.keywordRow}>
              <Text style={styles.keywordText}>🔔 {item}</Text>

              <TouchableOpacity onPress={() => handleRemoveKeyword(item)}>
                <Text style={styles.deleteText}>삭제</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
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

  inputRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 15,
  },

  addButton: {
    marginLeft: 10,
    backgroundColor: '#6EA8FF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  count: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: '#A3A3A3',
    fontSize: 16,
    fontWeight: '600',
  },

  listWrap: {
    marginTop: 24,
  },

  keywordRow: {
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  keywordText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  deleteText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '700',
  },
});