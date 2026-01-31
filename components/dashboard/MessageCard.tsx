// components/dashboard/MessageCard.tsx
// Message card component for dashboard

import { Icon } from '@ui-kitten/components';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MessageCardProps {
  content: string;
  category: string;
  isFavorited?: boolean;
  author?: string;
  isRTL?: boolean;
  onPress?: () => void;
  backgroundImage?: string;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  content,
  category,
  isFavorited,
  author,
  isRTL,
  onPress,
  backgroundImage,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.cardContainer}>
      <ImageBackground
        source={backgroundImage ? { uri: backgroundImage } : require('@/assets/images/logo.png')}
        style={styles.imageBackground}
        imageStyle={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(49, 30, 19, 0.3)', 'rgba(83, 50, 29, 0.5)', 'rgba(147, 96, 54, 0.4)']}
          style={styles.gradientOverlay}
        >
          <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
            {/* Category badge at top */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>

            {/* Message content - centered */}
            <View style={styles.contentContainer}>
              <Text style={[styles.content, isRTL && styles.textRTL]} numberOfLines={6}>
                {content}
              </Text>
              {author && (
                <Text style={[styles.author, isRTL && styles.textRTL]}>- {author}</Text>
              )}
            </View>

            {/* Bottom action buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="heart" style={styles.actionIcon} fill={isFavorited ? "#C96F4A" : "#FAF8F5"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="bookmark" style={styles.actionIcon} fill="#FAF8F5" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="share" style={styles.actionIcon} fill="#FAF8F5" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="more-horizontal" style={styles.actionIcon} fill="#FAF8F5" />
              </TouchableOpacity>
            </View>
          </BlurView>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 24,
    overflow: 'hidden',
    height: 520,
    elevation: 8,
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    borderRadius: 24,
  },
  gradientOverlay: {
    flex: 1,
    borderRadius: 24,
  },
  blurContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(213, 204, 195, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(250, 248, 245, 0.2)',
  },
  categoryText: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontFamily: 'Inter',
    color: '#FAF8F5',
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  content: {
    fontSize: 22,
    lineHeight: 36,
    fontFamily: 'Inter',
    color: '#FAF8F5',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(49, 30, 19, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  textRTL: {
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.9,
    marginTop: 16,
    fontFamily: 'Inter',
    color: '#EBCE90',
    fontWeight: '300',
    textShadowColor: 'rgba(49, 30, 19, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 16,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(213, 204, 195, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(250, 248, 245, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
});
