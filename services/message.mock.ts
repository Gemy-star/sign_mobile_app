// services/message.mock.ts
// Mock motivational messages data

export interface MotivationalMessage {
  id: string;
  category: string;
  content: {
    en: string;
    ar: string;
  };
  author?: string;
  isFavorite: boolean;
  createdAt: string;
}

export const MOCK_MESSAGES: MotivationalMessage[] = [
  {
    id: '1',
    category: 'mental',
    content: {
      en: 'Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.',
      ar: 'عقلك شيء قوي. عندما تملؤه بالأفكار الإيجابية، ستبدأ حياتك بالتغيير.'
    },
    isFavorite: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    category: 'physical',
    content: {
      en: 'Take care of your body. It\'s the only place you have to live.',
      ar: 'اعتن بجسدك. إنه المكان الوحيد الذي يجب عليك العيش فيه.'
    },
    author: 'Jim Rohn',
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    category: 'career',
    content: {
      en: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      ar: 'النجاح ليس نهائيًا، والفشل ليس قاتلاً: إنها الشجاعة للاستمرار هي التي تهم.'
    },
    author: 'Winston Churchill',
    isFavorite: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    category: 'financial',
    content: {
      en: 'An investment in knowledge pays the best interest.',
      ar: 'الاستثمار في المعرفة يدفع أفضل فائدة.'
    },
    author: 'Benjamin Franklin',
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '5',
    category: 'relationships',
    content: {
      en: 'The quality of your life is the quality of your relationships.',
      ar: 'جودة حياتك هي جودة علاقاتك.'
    },
    author: 'Tony Robbins',
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '6',
    category: 'spiritual',
    content: {
      en: 'Peace comes from within. Do not seek it without.',
      ar: 'السلام يأتي من الداخل. لا تبحث عنه في الخارج.'
    },
    author: 'Buddha',
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '7',
    category: 'creativity',
    content: {
      en: 'Creativity is intelligence having fun.',
      ar: 'الإبداع هو الذكاء وهو يستمتع.'
    },
    author: 'Albert Einstein',
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '8',
    category: 'lifestyle',
    content: {
      en: 'Life is what happens when you\'re busy making other plans.',
      ar: 'الحياة هي ما يحدث عندما تكون مشغولاً بوضع خطط أخرى.'
    },
    author: 'John Lennon',
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '9',
    category: 'mental',
    content: {
      en: 'Believe you can and you\'re halfway there.',
      ar: 'آمن بأنك تستطيع وستكون في منتصف الطريق.'
    },
    author: 'Theodore Roosevelt',
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: '10',
    category: 'physical',
    content: {
      en: 'The only bad workout is the one that didn\'t happen.',
      ar: 'التمرين السيئ الوحيد هو الذي لم يحدث.'
    },
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: '11',
    category: 'career',
    content: {
      en: 'The only way to do great work is to love what you do.',
      ar: 'الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.'
    },
    author: 'Steve Jobs',
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '12',
    category: 'financial',
    content: {
      en: 'Don\'t save what is left after spending; spend what is left after saving.',
      ar: 'لا توفر ما تبقى بعد الإنفاق؛ أنفق ما تبقى بعد التوفير.'
    },
    author: 'Warren Buffett',
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '13',
    category: 'relationships',
    content: {
      en: 'The best time to plant a tree was 20 years ago. The second best time is now.',
      ar: 'أفضل وقت لزراعة شجرة كان قبل 20 عامًا. ثاني أفضل وقت هو الآن.'
    },
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: '14',
    category: 'spiritual',
    content: {
      en: 'Your purpose in life is to find your purpose and give your whole heart and soul to it.',
      ar: 'هدفك في الحياة هو أن تجد هدفك وتعطيه كل قلبك وروحك.'
    },
    author: 'Buddha',
    isFavorite: false,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: '15',
    category: 'creativity',
    content: {
      en: 'Every artist was first an amateur.',
      ar: 'كل فنان كان في البداية هاويًا.'
    },
    author: 'Ralph Waldo Emerson',
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export interface ChatMessage {
  id: string;
  sender: {
    name: {
      en: string;
      ar: string;
    };
    avatar: string;
  };
  lastMessage: {
    en: string;
    ar: string;
  };
  time: string;
  unreadCount?: number;
}

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: {
      name: { en: 'Ibrahim Ali', ar: 'إبراهيم علي' },
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    lastMessage: {
      en: 'How are you doing today?',
      ar: 'كيف حالك اليوم؟'
    },
    time: '02:30 PM',
    unreadCount: 2,
  },
  {
    id: '2',
    sender: {
      name: { en: 'Ali Ahmed', ar: 'علي أحمد' },
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    lastMessage: {
      en: 'Thanks for your help!',
      ar: 'شكراً على مساعدتك!'
    },
    time: '01:15 PM',
  },
  {
    id: '3',
    sender: {
      name: { en: 'Mohamed Saber', ar: 'محمد صابر' },
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    lastMessage: {
      en: 'See you tomorrow',
      ar: 'أراك غداً'
    },
    time: '11:45 AM',
  },
  {
    id: '4',
    sender: {
      name: { en: 'Adel Ahmed', ar: 'عادل أحمد' },
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    lastMessage: {
      en: 'Great job on the project!',
      ar: 'عمل رائع في المشروع!'
    },
    time: '10:20 AM',
  },
  {
    id: '5',
    sender: {
      name: { en: 'Khalid Hassan', ar: 'خالد حسن' },
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    lastMessage: {
      en: 'Let\'s meet next week',
      ar: 'دعنا نلتقي الأسبوع القادم'
    },
    time: 'Yesterday',
  },
  {
    id: '6',
    sender: {
      name: { en: 'Omar Youssef', ar: 'عمر يوسف' },
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
    lastMessage: {
      en: 'Have a great day!',
      ar: 'أتمنى لك يوماً رائعاً!'
    },
    time: 'Yesterday',
  },
];
