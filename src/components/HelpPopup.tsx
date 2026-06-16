import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  visible: boolean;
  title?: string;
  body: string;
  onClose: () => void;
};

export default function HelpPopup({ visible, title, body, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* ✅ 바깥(배경) 눌렀을 때만 닫히도록: backdrop이 부모 */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* ✅ 시트 눌렀을 땐 닫히면 안 되므로 stopPropagation */}
        <Pressable
          style={styles.center}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.sheet}>
            {!!title && <Text style={styles.title}>{title}</Text>}

            <View style={styles.divider} />

            <Text style={styles.body}>{body}</Text>

            {/* 닫기 버튼 (가운데 하단, 파란색) */}
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>닫기</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const BLUE = '#3B82F6';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  center: {
    width: '100%',
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center', // ✅ 가운데
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 12,
    marginBottom: 12,
  },
  body: {
    fontSize: 12.5,
    color: '#374151',
    lineHeight: 18,
    textAlign: 'center', // ✅ 가운데(요청하신 “손가락 하나…”도 가운데)
  },
  closeBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeTxt: {
    color: BLUE,
    fontSize: 13,
    fontWeight: '900',
  },
});