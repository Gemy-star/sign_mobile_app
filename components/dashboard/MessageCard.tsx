// components/dashboard/MessageCard.tsx
// Message card component for dashboard

import { FontFamily } from '@/constants/Typography';
import { Card, Icon, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface MessageCardProps {
  content: string;
  category: string;
  isFavorited?: boolean;
  author?: string;
  isRTL?: boolean;
  onPress?: () => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  content,
  category,
  isFavorited,
  author,
  isRTL,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={[styles.header, isRTL && styles.headerRTL]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          {isFavorited && <Icon name="star" style={styles.favoriteIcon} fill="#f59e0b" />}
        </View>
        <Text style={[styles.content, isRTL && styles.textRTL]}>{content}</Text>
        {author && (
          <Text style={[styles.author, isRTL && styles.textRTL]}>- {author}</Text>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  categoryBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontFamily: FontFamily.arabicMedium,
    color: '#6b7280',
  },
  favoriteIcon: {
    width: 18,
    height: 18,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: FontFamily.arabic,
    color: '#374151',
  },
  textRTL: {
    textAlign: 'right',
  },
  author: {
    fontSize: 13,
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 12,
    fontFamily: FontFamily.arabicLight,
  },
});
