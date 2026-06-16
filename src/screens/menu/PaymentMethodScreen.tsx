import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type CardItem = {
  id: string;
  company: string;
  numberMasked: string;
  isBasic?: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethod'>;

export default function PaymentMethodScreen({ navigation, route }: Props) {
  const [cards, setCards] = useState<CardItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      const newCard = route.params?.newCard;

      if (newCard) {
        setCards((prev) => {
          const exists = prev.some((item) => item.id === newCard.id);
          if (exists) return prev;

          const next = [...prev, newCard];

          if (next.length === 1) {
            next[0].isBasic = true;
          }

          return next;
        });

        navigation.setParams({ newCard: undefined });
      }
    }, [route.params, navigation])
  );

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

        <Text style={styles.title}>결제수단 관리</Text>

        <View style={styles.sideBtn} />
      </View>

      <Text style={styles.section}>신용/체크카드</Text>

      {cards.length === 0 ? (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('PaymentCardAdd')}
        >
          <Text style={styles.addBtnText}>신용/체크카드 등록</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.listWrap}>
          {cards.map((card) => (
            <View key={card.id} style={styles.cardRow}>
              <View style={styles.cardLogo}>
                <Text style={styles.cardLogoText}>KB</Text>
              </View>

              <View style={styles.cardInfo}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardName}>{card.company}</Text>

                  {card.isBasic ? (
                    <View style={styles.basicBadge}>
                      <Text style={styles.basicBadgeText}>기본</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.cardNumber}>{card.numberMasked}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.addBtn, { marginTop: 20 }]}
            onPress={() => navigation.navigate('PaymentCardAdd')}
          >
            <Text style={styles.addBtnText}>카드 추가 등록</Text>
          </TouchableOpacity>
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

  section: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },

  addBtn: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#6EA8FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addBtnText: {
    color: '#6EA8FF',
    fontSize: 15,
    fontWeight: '700',
  },

  listWrap: {
    marginTop: 4,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingVertical: 4,
  },

  cardLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F7D54A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  cardLogoText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#3C2F00',
  },

  cardInfo: {
    flex: 1,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },

  cardName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginRight: 8,
  },

  basicBadge: {
    backgroundColor: '#FFE6E6',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  basicBadgeText: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '700',
  },

  cardNumber: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});