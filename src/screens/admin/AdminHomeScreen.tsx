import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllAdminInquiries } from '../../api/admin';

export default function AdminHomeScreen() {
  const navigation = useNavigation<any>();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await getAllAdminInquiries();
      setInquiries(data);
    } catch (e) {
      console.error('Failed to load inquiries', e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.status}>{item.answered ? '답변완료' : '대기중'}</Text>
        <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>작성자: {item.authorId || '알 수 없음'}</Text>
      <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
      {!item.answered && (
        <TouchableOpacity style={styles.answerBtn}>
          <Text style={styles.answerBtnText}>답변 달기 (예정)</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>관리자 대시보드</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0E7AF1" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={inquiries}
            keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>문의 내역이 없습니다.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', paddingHorizontal: 16 },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  backBtnText: { fontSize: 32, color: '#111' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  container: { flex: 1 },
  listContent: { padding: 16 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  status: { color: '#0E7AF1', fontWeight: 'bold' },
  date: { color: '#888', fontSize: 12 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#111' },
  author: { fontSize: 12, color: '#555', marginBottom: 8 },
  content: { fontSize: 14, color: '#444', marginBottom: 12 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
  answerBtn: { backgroundColor: '#EEF4FF', padding: 12, borderRadius: 8, alignItems: 'center' },
  answerBtnText: { color: '#0E7AF1', fontWeight: 'bold' }
});
