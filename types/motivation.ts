// types/motivation.ts
// Type definitions for the motivational app

export type MotivationCategory =
  | 'mental'
  | 'physical'
  | 'career'
  | 'financial'
  | 'relationships'
  | 'spiritual'
  | 'creativity'
  | 'lifestyle';

export type SubCategory = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
};

export type CategoryData = {
  id: MotivationCategory;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  emoji: string;
  subCategories: SubCategory[];
};

export type MessageTone =
  | 'encouraging'
  | 'energetic'
  | 'calm'
  | 'direct'
  | 'inspirational'
  | 'humorous';

export type MessageFrequency =
  | 'hourly'
  | 'daily'
  | 'twice-daily'
  | 'weekly'
  | 'custom';

export type NotificationSettings = {
  enabled: boolean;
  frequency: MessageFrequency;
  customSchedule?: string[];
  ringtone: string;
  vibration: boolean;
  multipleAlerts: boolean;
  alertCount: number;
};

export type UserPreferences = {
  selectedCategories: string[];
  selectedSubCategories: string[];
  messageTone: MessageTone;
  frequency: MessageFrequency;
  language: 'en' | 'ar';
  notifications: NotificationSettings;
};

export type MotivationalMessage = {
  id: string;
  category: MotivationCategory;
  subCategory?: string;
  content: string;
  contentAr?: string;
  tone: MessageTone;
  timestamp: number;
  isFavorite: boolean;
  isRead: boolean;
};

export type UserStats = {
  totalMessagesReceived: number;
  totalMessagesSent: number;
  favoriteCount: number;
  currentStreak: number;
  longestStreak: number;
  categoriesActive: number;
};

// Category definitions with all subcategories
export const MOTIVATION_CATEGORIES: CategoryData[] = [
  {
    id: 'mental',
    nameKey: 'categories.mental.name',
    descriptionKey: 'categories.mental.description',
    icon: 'brain',
    color: '#eb672a',
    emoji: '🧠',
    subCategories: [
      { id: 'emotional-intelligence', nameKey: 'categories.mental.emotional', descriptionKey: 'categories.mental.emotionalDesc', icon: 'heart-pulse' },
      { id: 'mindset-resilience', nameKey: 'categories.mental.mindset', descriptionKey: 'categories.mental.mindsetDesc', icon: 'shield-check' },
      { id: 'self-awareness', nameKey: 'categories.mental.awareness', descriptionKey: 'categories.mental.awarenessDesc', icon: 'eye' },
      { id: 'focus-discipline', nameKey: 'categories.mental.focus', descriptionKey: 'categories.mental.focusDesc', icon: 'target' },
    ],
  },
  {
    id: 'physical',
    nameKey: 'categories.physical.name',
    descriptionKey: 'categories.physical.description',
    icon: 'dumbbell',
    color: '#48bb78',
    emoji: '💪',
    subCategories: [
      { id: 'exercise-fitness', nameKey: 'categories.physical.exercise', descriptionKey: 'categories.physical.exerciseDesc', icon: 'activity' },
      { id: 'nutrition-diet', nameKey: 'categories.physical.nutrition', descriptionKey: 'categories.physical.nutritionDesc', icon: 'apple' },
      { id: 'sleep-recovery', nameKey: 'categories.physical.sleep', descriptionKey: 'categories.physical.sleepDesc', icon: 'moon' },
      { id: 'healthy-habits', nameKey: 'categories.physical.habits', descriptionKey: 'categories.physical.habitsDesc', icon: 'check-circle' },
    ],
  },
  {
    id: 'career',
    nameKey: 'categories.career.name',
    descriptionKey: 'categories.career.description',
    icon: 'briefcase',
    color: '#815ba4',
    emoji: '💼',
    subCategories: [
      { id: 'skill-building', nameKey: 'categories.career.skills', descriptionKey: 'categories.career.skillsDesc', icon: 'tool' },
      { id: 'productivity', nameKey: 'categories.career.productivity', descriptionKey: 'categories.career.productivityDesc', icon: 'zap' },
      { id: 'networking', nameKey: 'categories.career.networking', descriptionKey: 'categories.career.networkingDesc', icon: 'users' },
      { id: 'career-planning', nameKey: 'categories.career.planning', descriptionKey: 'categories.career.planningDesc', icon: 'map' },
    ],
  },
  {
    id: 'financial',
    nameKey: 'categories.financial.name',
    descriptionKey: 'categories.financial.description',
    icon: 'dollar-sign',
    color: '#ed8936',
    emoji: '💰',
    subCategories: [
      { id: 'budgeting-saving', nameKey: 'categories.financial.budgeting', descriptionKey: 'categories.financial.budgetingDesc', icon: 'piggy-bank' },
      { id: 'investing', nameKey: 'categories.financial.investing', descriptionKey: 'categories.financial.investingDesc', icon: 'trending-up' },
      { id: 'debt-management', nameKey: 'categories.financial.debt', descriptionKey: 'categories.financial.debtDesc', icon: 'credit-card' },
      { id: 'financial-literacy', nameKey: 'categories.financial.literacy', descriptionKey: 'categories.financial.literacyDesc', icon: 'book-open' },
    ],
  },
  {
    id: 'relationships',
    nameKey: 'categories.relationships.name',
    descriptionKey: 'categories.relationships.description',
    icon: 'heart',
    color: '#f56565',
    emoji: '❤️',
    subCategories: [
      { id: 'family-friendships', nameKey: 'categories.relationships.family', descriptionKey: 'categories.relationships.familyDesc', icon: 'users' },
      { id: 'romantic', nameKey: 'categories.relationships.romantic', descriptionKey: 'categories.relationships.romanticDesc', icon: 'heart' },
      { id: 'community', nameKey: 'categories.relationships.community', descriptionKey: 'categories.relationships.communityDesc', icon: 'globe' },
      { id: 'conflict-resolution', nameKey: 'categories.relationships.conflict', descriptionKey: 'categories.relationships.conflictDesc', icon: 'message-circle' },
    ],
  },
  {
    id: 'spiritual',
    nameKey: 'categories.spiritual.name',
    descriptionKey: 'categories.spiritual.description',
    icon: 'sparkles',
    color: '#4299e1',
    emoji: '🕊️',
    subCategories: [
      { id: 'purpose-meaning', nameKey: 'categories.spiritual.purpose', descriptionKey: 'categories.spiritual.purposeDesc', icon: 'compass' },
      { id: 'mindfulness', nameKey: 'categories.spiritual.mindfulness', descriptionKey: 'categories.spiritual.mindfulnessDesc', icon: 'flower' },
      { id: 'gratitude', nameKey: 'categories.spiritual.gratitude', descriptionKey: 'categories.spiritual.gratitudeDesc', icon: 'gift' },
      { id: 'connection', nameKey: 'categories.spiritual.connection', descriptionKey: 'categories.spiritual.connectionDesc', icon: 'link' },
    ],
  },
  {
    id: 'creativity',
    nameKey: 'categories.creativity.name',
    descriptionKey: 'categories.creativity.description',
    icon: 'palette',
    color: '#9a7cb6',
    emoji: '🎨',
    subCategories: [
      { id: 'continuous-learning', nameKey: 'categories.creativity.learning', descriptionKey: 'categories.creativity.learningDesc', icon: 'book' },
      { id: 'creative-expression', nameKey: 'categories.creativity.expression', descriptionKey: 'categories.creativity.expressionDesc', icon: 'feather' },
      { id: 'curiosity', nameKey: 'categories.creativity.curiosity', descriptionKey: 'categories.creativity.curiosityDesc', icon: 'search' },
    ],
  },
  {
    id: 'lifestyle',
    nameKey: 'categories.lifestyle.name',
    descriptionKey: 'categories.lifestyle.description',
    icon: 'sun',
    color: '#38b2ac',
    emoji: '🌍',
    subCategories: [
      { id: 'work-life-balance', nameKey: 'categories.lifestyle.balance', descriptionKey: 'categories.lifestyle.balanceDesc', icon: 'scale' },
      { id: 'organization', nameKey: 'categories.lifestyle.organization', descriptionKey: 'categories.lifestyle.organizationDesc', icon: 'layout' },
      { id: 'sustainability', nameKey: 'categories.lifestyle.sustainability', descriptionKey: 'categories.lifestyle.sustainabilityDesc', icon: 'leaf' },
      { id: 'adventure', nameKey: 'categories.lifestyle.adventure', descriptionKey: 'categories.lifestyle.adventureDesc', icon: 'plane' },
    ],
  },
];
