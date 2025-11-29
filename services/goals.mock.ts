// services/goals.mock.ts
// Mock data for goals

export interface Goal {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  category: string;
  progress: number; // 0-100
  targetDate: string;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export const MOCK_GOALS: Goal[] = [
  {
    id: '1',
    title: {
      en: 'Exercise 5 times a week',
      ar: 'ممارسة الرياضة 5 مرات أسبوعياً'
    },
    description: {
      en: 'Build a consistent workout routine to improve physical health',
      ar: 'بناء روتين رياضي منتظم لتحسين الصحة البدنية'
    },
    category: 'physical',
    progress: 75,
    targetDate: '2025-12-31',
    isCompleted: false,
    priority: 'high',
    createdAt: '2025-11-01'
  },
  {
    id: '2',
    title: {
      en: 'Read 12 books this year',
      ar: 'قراءة 12 كتاباً هذا العام'
    },
    description: {
      en: 'Expand knowledge and mental growth through reading',
      ar: 'توسيع المعرفة والنمو العقلي من خلال القراءة'
    },
    category: 'mental',
    progress: 60,
    targetDate: '2025-12-31',
    isCompleted: false,
    priority: 'medium',
    createdAt: '2025-01-15'
  },
  {
    id: '3',
    title: {
      en: 'Save $5000 for emergency fund',
      ar: 'توفير 5000 دولار لصندوق الطوارئ'
    },
    description: {
      en: 'Build financial security and peace of mind',
      ar: 'بناء الأمان المالي وراحة البال'
    },
    category: 'financial',
    progress: 40,
    targetDate: '2026-06-30',
    isCompleted: false,
    priority: 'high',
    createdAt: '2025-03-01'
  },
  {
    id: '4',
    title: {
      en: 'Learn a new language',
      ar: 'تعلم لغة جديدة'
    },
    description: {
      en: 'Master conversational Spanish for travel and career growth',
      ar: 'إتقان اللغة الإسبانية المحادثة للسفر والنمو المهني'
    },
    category: 'career',
    progress: 30,
    targetDate: '2026-03-31',
    isCompleted: false,
    priority: 'medium',
    createdAt: '2025-09-01'
  },
  {
    id: '5',
    title: {
      en: 'Meditate daily for 30 days',
      ar: 'التأمل يومياً لمدة 30 يوماً'
    },
    description: {
      en: 'Develop mindfulness and reduce stress through meditation',
      ar: 'تطوير اليقظة الذهنية والحد من التوتر من خلال التأمل'
    },
    category: 'spiritual',
    progress: 90,
    targetDate: '2025-12-15',
    isCompleted: false,
    priority: 'medium',
    createdAt: '2025-11-15'
  },
  {
    id: '6',
    title: {
      en: 'Complete online certification',
      ar: 'إكمال الشهادة عبر الإنترنت'
    },
    description: {
      en: 'Earn professional certification in cloud computing',
      ar: 'الحصول على شهادة مهنية في الحوسبة السحابية'
    },
    category: 'career',
    progress: 100,
    targetDate: '2025-11-30',
    isCompleted: true,
    priority: 'high',
    createdAt: '2025-08-01'
  },
  {
    id: '7',
    title: {
      en: 'Strengthen family relationships',
      ar: 'تعزيز العلاقات الأسرية'
    },
    description: {
      en: 'Spend quality time with family every weekend',
      ar: 'قضاء وقت ممتع مع العائلة كل عطلة نهاية أسبوع'
    },
    category: 'relationships',
    progress: 85,
    targetDate: '2025-12-31',
    isCompleted: false,
    priority: 'high',
    createdAt: '2025-01-01'
  },
  {
    id: '8',
    title: {
      en: 'Start a creative project',
      ar: 'بدء مشروع إبداعي'
    },
    description: {
      en: 'Create and launch a personal blog or portfolio',
      ar: 'إنشاء وإطلاق مدونة شخصية أو محفظة أعمال'
    },
    category: 'creativity',
    progress: 50,
    targetDate: '2026-01-31',
    isCompleted: false,
    priority: 'low',
    createdAt: '2025-10-01'
  },
  {
    id: '9',
    title: {
      en: 'Improve sleep schedule',
      ar: 'تحسين جدول النوم'
    },
    description: {
      en: 'Maintain consistent 7-8 hours sleep every night',
      ar: 'الحفاظ على 7-8 ساعات نوم متواصلة كل ليلة'
    },
    category: 'lifestyle',
    progress: 65,
    targetDate: '2025-12-31',
    isCompleted: false,
    priority: 'high',
    createdAt: '2025-06-01'
  },
  {
    id: '10',
    title: {
      en: 'Volunteer monthly',
      ar: 'التطوع شهرياً'
    },
    description: {
      en: 'Give back to the community through regular volunteering',
      ar: 'رد الجميل للمجتمع من خلال التطوع المنتظم'
    },
    category: 'spiritual',
    progress: 70,
    targetDate: '2025-12-31',
    isCompleted: false,
    priority: 'medium',
    createdAt: '2025-02-01'
  }
];
