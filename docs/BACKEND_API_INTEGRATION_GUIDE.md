# Backend API Integration Guide

## Overview
This document describes how the backend should handle API requests for all screens in the application. The app is a motivational message delivery platform with topic-based personalization, user authentication, subscriptions, and message management.

## Base URL
```
Production: https://api.yourapp.com/v1
Staging: https://staging-api.yourapp.com/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {access_token}
```

---

## 1. Authentication Flow

### 1.1 Login Screen
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "phone": "+1234567890",
      "language": "en",
      "created_at": "2026-01-01T00:00:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 3600
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### 1.2 Register Screen
**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "full_name": "John Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "password_confirmation": "password123",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "phone": "+1234567890",
      "language": "en",
      "created_at": "2026-01-01T00:00:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 3600
    }
  }
}
```

### 1.3 Token Refresh
**Endpoint:** `POST /auth/refresh`

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### 1.4 Logout
**Endpoint:** `POST /auth/logout`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

## 2. Onboarding Flow

### 2.1 Topic Selection Screen
**Endpoint:** `POST /user/topics`

**Headers:** Requires authentication

**Request:**
```json
{
  "topic_ids": ["motivation", "health", "career", "mindfulness", "productivity"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "selected_topics": [
      {
        "id": "motivation",
        "name": "Motivation",
        "name_ar": "تحفيز"
      },
      {
        "id": "health",
        "name": "Health & Fitness",
        "name_ar": "صحة ولياقة"
      }
    ],
    "updated_at": "2026-01-31T10:00:00Z"
  }
}
```

**Notes:**
- User must select at least 3 topics
- Topics will be used to personalize message delivery
- Topics can be updated later in user preferences

### 2.2 Get Available Topics
**Endpoint:** `GET /topics`

**Response:**
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": "motivation",
        "name": "Motivation",
        "name_ar": "تحفيز",
        "description": "Inspiring messages to keep you motivated",
        "description_ar": "رسائل ملهمة للحفاظ على تحفيزك"
      },
      {
        "id": "health",
        "name": "Health & Fitness",
        "name_ar": "صحة ولياقة",
        "description": "Health and wellness tips",
        "description_ar": "نصائح الصحة والعافية"
      }
    ]
  }
}
```

---

## 3. Subscription Management

### 3.1 Packages Screen - Get Available Packages
**Endpoint:** `GET /packages`

**Response:**
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": 1,
        "name": "Basic",
        "name_ar": "أساسي",
        "description": "Daily motivational messages",
        "description_ar": "رسائل تحفيزية يومية",
        "price": 9.99,
        "currency": "USD",
        "duration_days": 30,
        "features": [
          "1 message per day",
          "Basic topics",
          "Email support"
        ],
        "features_ar": [
          "رسالة واحدة يومياً",
          "مواضيع أساسية",
          "دعم عبر البريد الإلكتروني"
        ],
        "is_popular": false
      },
      {
        "id": 2,
        "name": "Premium",
        "name_ar": "مميز",
        "description": "Unlimited messages with AI customization",
        "description_ar": "رسائل غير محدودة مع تخصيص الذكاء الاصطناعي",
        "price": 29.99,
        "currency": "USD",
        "duration_days": 30,
        "features": [
          "Unlimited messages",
          "All topics",
          "AI customization",
          "Priority support"
        ],
        "features_ar": [
          "رسائل غير محدودة",
          "جميع المواضيع",
          "تخصيص الذكاء الاصطناعي",
          "دعم ذو أولوية"
        ],
        "is_popular": true
      }
    ]
  }
}
```

### 3.2 Subscribe to Package
**Endpoint:** `POST /subscriptions`

**Headers:** Requires authentication

**Request:**
```json
{
  "package_id": 2,
  "payment_method": "stripe",
  "payment_token": "tok_visa"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": 123,
      "user_id": 1,
      "package_id": 2,
      "package_name": "Premium",
      "start_date": "2026-01-31T10:00:00Z",
      "end_date": "2026-03-02T10:00:00Z",
      "status": "active",
      "auto_renew": true
    },
    "payment": {
      "id": "pay_123456",
      "amount": 29.99,
      "currency": "USD",
      "status": "succeeded"
    }
  }
}
```

### 3.3 Get Active Subscription
**Endpoint:** `GET /subscriptions/active`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": 123,
      "package_name": "Premium",
      "package_name_ar": "مميز",
      "start_date": "2026-01-31T10:00:00Z",
      "end_date": "2026-03-02T10:00:00Z",
      "days_remaining": 30,
      "status": "active",
      "auto_renew": true
    }
  }
}
```

**No Active Subscription:**
```json
{
  "success": true,
  "data": null
}
```

### 3.4 Cancel Subscription
**Endpoint:** `DELETE /subscriptions/{subscription_id}`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": 123,
      "status": "cancelled",
      "cancelled_at": "2026-01-31T10:00:00Z",
      "end_date": "2026-03-02T10:00:00Z"
    },
    "message": "Subscription will remain active until end date"
  }
}
```

---

## 4. Dashboard & Messages

### 4.1 Dashboard Screen - Get Dashboard Data
**Endpoint:** `GET /dashboard`

**Headers:** Requires authentication

**Query Parameters:**
- `language`: "en" or "ar"

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "full_name": "John Doe",
      "streak_days": 7,
      "total_messages_read": 45,
      "favorite_messages_count": 12
    },
    "daily_message": {
      "id": 1,
      "content": "She said yes — to the man I've become.The boy, I've become.",
      "scope_name": "Relationships",
      "scope_name_ar": "علاقات",
      "message_type_display": "Motivational",
      "is_favorited": false,
      "user_rating": null,
      "background_image": "https://cdn.example.com/images/message1.jpg",
      "created_at": "2026-01-31T00:00:00Z"
    },
    "stats": {
      "messages_this_week": 7,
      "favorite_count": 12,
      "streak_days": 7,
      "total_read": 45
    },
    "recent_messages": [
      {
        "id": 2,
        "content": "Success is not final, failure is not fatal...",
        "scope_name": "Success",
        "scope_name_ar": "نجاح",
        "is_favorited": true,
        "created_at": "2026-01-30T00:00:00Z"
      }
    ]
  }
}
```

### 4.2 Messages Screen - Get All Messages
**Endpoint:** `GET /messages`

**Headers:** Requires authentication

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20)
- `scope`: Filter by topic/scope ID (optional)
- `is_favorited`: Filter favorites (optional, boolean)
- `language`: "en" or "ar"

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": 1,
        "content": "She said yes — to the man I've become.The boy, I've become.",
        "scope_name": "Relationships",
        "scope_name_ar": "علاقات",
        "message_type_display": "Motivational",
        "message_type_display_ar": "تحفيزي",
        "is_favorited": false,
        "user_rating": 5,
        "ai_model": "GPT-4",
        "background_image": "https://cdn.example.com/images/message1.jpg",
        "goal_title": "Improve Communication",
        "goal_title_ar": "تحسين التواصل",
        "created_at": "2026-01-31T00:00:00Z",
        "read_at": "2026-01-31T08:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 95,
      "per_page": 20
    }
  }
}
```

### 4.3 Message Detail Screen - Get Single Message
**Endpoint:** `GET /messages/{message_id}`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "content": "She said yes — to the man I've become.The boy, I've become.",
    "scope_name": "Relationships",
    "scope_name_ar": "علاقات",
    "message_type_display": "Motivational",
    "message_type_display_ar": "تحفيزي",
    "is_favorited": false,
    "user_rating": 5,
    "ai_model": "GPT-4",
    "background_image": "https://cdn.example.com/images/message1.jpg",
    "goal_title": "Improve Communication",
    "goal_title_ar": "تحسين التواصل",
    "goal_description": "Focus on building stronger relationships",
    "created_at": "2026-01-31T00:00:00Z",
    "read_at": "2026-01-31T08:00:00Z"
  }
}
```

### 4.4 Toggle Favorite
**Endpoint:** `POST /messages/{message_id}/favorite`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "is_favorited": true,
    "message_id": 1
  }
}
```

### 4.5 Rate Message
**Endpoint:** `POST /messages/{message_id}/rate`

**Headers:** Requires authentication

**Request:**
```json
{
  "rating": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message_id": 1,
    "rating": 5,
    "rated_at": "2026-01-31T10:00:00Z"
  }
}
```

**Notes:**
- Rating must be between 1 and 5
- Used to improve AI message personalization

### 4.6 Category Detail Screen - Get Messages by Category
**Endpoint:** `GET /messages`

**Query Parameters:**
- `scope`: Category/topic ID (required)
- `page`: Page number
- `per_page`: Items per page

**Response:** Same as 4.2 but filtered by category

---

## 5. Motivation & Goals

### 5.1 Welcome Motivation Screen - Get Motivational Quote
**Endpoint:** `GET /motivation/daily`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "quote": "The only way to do great work is to love what you do.",
    "quote_ar": "الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.",
    "author": "Steve Jobs",
    "category": "Success"
  }
}
```

### 5.2 Category Selection Screen - Get Available Categories
**Endpoint:** `GET /scopes`

**Response:**
```json
{
  "success": true,
  "data": {
    "scopes": [
      {
        "id": 1,
        "name": "Mental Health",
        "name_ar": "الصحة النفسية",
        "description": "Mental wellness and mindfulness",
        "icon": "brain-outline",
        "color": "#6366f1",
        "message_count": 150
      },
      {
        "id": 2,
        "name": "Physical Health",
        "name_ar": "الصحة البدنية",
        "description": "Fitness and physical wellness",
        "icon": "barbell-outline",
        "color": "#10b981",
        "message_count": 120
      }
    ]
  }
}
```

### 5.3 Get User Goals
**Endpoint:** `GET /goals`

**Headers:** Requires authentication

**Query Parameters:**
- `status`: "active", "completed", "paused" (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": 1,
        "title": "Exercise 3 times per week",
        "title_ar": "ممارسة الرياضة 3 مرات في الأسبوع",
        "description": "Build a consistent fitness routine",
        "scope_id": 2,
        "scope_name": "Physical Health",
        "target_value": 12,
        "current_value": 8,
        "unit": "sessions",
        "start_date": "2026-01-01",
        "end_date": "2026-03-31",
        "status": "active",
        "progress_percentage": 66.67,
        "created_at": "2026-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 5.4 Create Goal
**Endpoint:** `POST /goals`

**Headers:** Requires authentication

**Request:**
```json
{
  "title": "Exercise 3 times per week",
  "description": "Build a consistent fitness routine",
  "scope_id": 2,
  "target_value": 12,
  "unit": "sessions",
  "start_date": "2026-01-01",
  "end_date": "2026-03-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "goal": {
      "id": 1,
      "title": "Exercise 3 times per week",
      "scope_id": 2,
      "status": "active",
      "created_at": "2026-01-31T10:00:00Z"
    }
  }
}
```

### 5.5 Update Goal Progress
**Endpoint:** `PATCH /goals/{goal_id}/progress`

**Headers:** Requires authentication

**Request:**
```json
{
  "current_value": 9,
  "notes": "Completed workout session"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "goal": {
      "id": 1,
      "current_value": 9,
      "progress_percentage": 75,
      "updated_at": "2026-01-31T10:00:00Z"
    }
  }
}
```

---

## 6. Notifications

### 6.1 Notification Screen - Get Notifications
**Endpoint:** `GET /notifications`

**Headers:** Requires authentication

**Query Parameters:**
- `page`: Page number
- `per_page`: Items per page
- `is_read`: Filter by read status (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "title": "New message available",
        "title_ar": "رسالة جديدة متاحة",
        "body": "Check out today's motivational message",
        "body_ar": "اطلع على رسالة اليوم التحفيزية",
        "type": "new_message",
        "data": {
          "message_id": 123
        },
        "is_read": false,
        "created_at": "2026-01-31T09:00:00Z"
      },
      {
        "id": 2,
        "title": "Goal milestone reached",
        "title_ar": "تم الوصول إلى هدف المعلم",
        "body": "You've completed 75% of your goal!",
        "body_ar": "لقد أكملت 75٪ من هدفك!",
        "type": "goal_progress",
        "data": {
          "goal_id": 1
        },
        "is_read": true,
        "created_at": "2026-01-30T15:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_count": 45,
      "per_page": 20
    },
    "unread_count": 5
  }
}
```

### 6.2 Mark Notification as Read
**Endpoint:** `PATCH /notifications/{notification_id}/read`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "notification_id": 1,
    "is_read": true
  }
}
```

### 6.3 Mark All as Read
**Endpoint:** `POST /notifications/mark-all-read`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "marked_count": 5
  }
}
```

### 6.4 Update Notification Preferences
**Endpoint:** `PUT /notifications/preferences`

**Headers:** Requires authentication

**Request:**
```json
{
  "push_enabled": true,
  "email_enabled": true,
  "daily_message_reminder": true,
  "goal_progress_updates": true,
  "new_features": false,
  "quiet_hours_enabled": true,
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "08:00"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "push_enabled": true,
      "email_enabled": true,
      "daily_message_reminder": true,
      "goal_progress_updates": true,
      "new_features": false,
      "quiet_hours_enabled": true,
      "quiet_hours_start": "22:00",
      "quiet_hours_end": "08:00",
      "updated_at": "2026-01-31T10:00:00Z"
    }
  }
}
```

---

## 7. User Profile

### 7.1 Profile Screen - Get User Profile
**Endpoint:** `GET /user/profile`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "phone": "+1234567890",
      "language": "en",
      "avatar_url": "https://cdn.example.com/avatars/user1.jpg",
      "selected_topics": ["motivation", "health", "career"],
      "created_at": "2026-01-01T00:00:00Z"
    },
    "stats": {
      "total_messages_read": 45,
      "favorite_messages": 12,
      "streak_days": 7,
      "active_goals": 3,
      "completed_goals": 5
    },
    "subscription": {
      "package_name": "Premium",
      "status": "active",
      "end_date": "2026-03-02T10:00:00Z",
      "days_remaining": 30
    }
  }
}
```

### 7.2 Update Profile
**Endpoint:** `PUT /user/profile`

**Headers:** Requires authentication

**Request:**
```json
{
  "full_name": "John Doe Updated",
  "phone": "+1234567890",
  "language": "ar",
  "avatar_url": "https://cdn.example.com/avatars/new-avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe Updated",
      "phone": "+1234567890",
      "language": "ar",
      "avatar_url": "https://cdn.example.com/avatars/new-avatar.jpg",
      "updated_at": "2026-01-31T10:00:00Z"
    }
  }
}
```

### 7.3 Change Password Screen
**Endpoint:** `POST /user/change-password`

**Headers:** Requires authentication

**Request:**
```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword123",
  "new_password_confirmation": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 7.4 Privacy & Security Settings
**Endpoint:** `GET /user/privacy-settings`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "profile_visibility": "private",
      "activity_tracking": true,
      "data_sharing": false,
      "third_party_analytics": false
    }
  }
}
```

**Endpoint:** `PUT /user/privacy-settings`

**Request:**
```json
{
  "profile_visibility": "public",
  "activity_tracking": true,
  "data_sharing": false,
  "third_party_analytics": false
}
```

---

## 8. Message Customization

### 8.1 Message Customization Screen - Get Customization Settings
**Endpoint:** `GET /user/message-preferences`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "delivery_time": "09:00",
      "timezone": "America/New_York",
      "message_length": "medium",
      "tone": "inspirational",
      "topics": ["motivation", "health", "career"],
      "exclude_topics": [],
      "ai_personalization": true,
      "use_goals_for_customization": true
    }
  }
}
```

### 8.2 Update Message Preferences
**Endpoint:** `PUT /user/message-preferences`

**Headers:** Requires authentication

**Request:**
```json
{
  "delivery_time": "08:00",
  "timezone": "America/New_York",
  "message_length": "short",
  "tone": "motivational",
  "topics": ["motivation", "health"],
  "ai_personalization": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "delivery_time": "08:00",
      "timezone": "America/New_York",
      "message_length": "short",
      "tone": "motivational",
      "topics": ["motivation", "health"],
      "ai_personalization": true,
      "updated_at": "2026-01-31T10:00:00Z"
    }
  }
}
```

---

## 9. Message History

### 9.1 Message History Screen
**Endpoint:** `GET /messages/history`

**Headers:** Requires authentication

**Query Parameters:**
- `start_date`: ISO 8601 date (optional)
- `end_date`: ISO 8601 date (optional)
- `page`: Page number
- `per_page`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 1,
        "content": "She said yes — to the man I've become.The boy, I've become.",
        "scope_name": "Relationships",
        "read_at": "2026-01-31T08:00:00Z",
        "is_favorited": true,
        "user_rating": 5,
        "created_at": "2026-01-31T00:00:00Z"
      }
    ],
    "statistics": {
      "total_messages": 45,
      "messages_this_month": 15,
      "favorite_count": 12,
      "average_rating": 4.5
    },
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_count": 45
    }
  }
}
```

---

## 10. Help & Support

### 10.1 Help & Support Screen - Get FAQ
**Endpoint:** `GET /support/faq`

**Query Parameters:**
- `language`: "en" or "ar"

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Getting Started",
        "name_ar": "البدء",
        "faqs": [
          {
            "id": 1,
            "question": "How do I get started?",
            "question_ar": "كيف أبدأ؟",
            "answer": "Sign up and select your topics...",
            "answer_ar": "قم بالتسجيل واختر مواضيعك..."
          }
        ]
      }
    ]
  }
}
```

### 10.2 Submit Support Ticket
**Endpoint:** `POST /support/tickets`

**Headers:** Requires authentication

**Request:**
```json
{
  "subject": "Unable to access messages",
  "description": "I'm having trouble viewing my daily messages",
  "category": "technical",
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticket": {
      "id": 12345,
      "subject": "Unable to access messages",
      "status": "open",
      "created_at": "2026-01-31T10:00:00Z",
      "estimated_response_time": "24 hours"
    }
  }
}
```

---

## 11. News & Updates

### 11.1 News Screen - Get News Articles
**Endpoint:** `GET /news`

**Query Parameters:**
- `page`: Page number
- `per_page`: Items per page
- `category`: Filter by category (optional)
- `language`: "en" or "ar"

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "New AI Features Available",
        "title_ar": "ميزات الذكاء الاصطناعي الجديدة متاحة",
        "summary": "Check out our latest AI-powered message customization",
        "summary_ar": "اطلع على أحدث تخصيص للرسائل بالذكاء الاصطناعي",
        "content": "Full article content...",
        "image_url": "https://cdn.example.com/news/article1.jpg",
        "category": "features",
        "published_at": "2026-01-30T00:00:00Z",
        "author": "Team"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 48
    }
  }
}
```

---

## 12. Error Handling

All API endpoints should return consistent error responses:

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "Specific error for this field"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid email or password |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `TOKEN_EXPIRED` | 401 | Access token has expired |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `SUBSCRIPTION_REQUIRED` | 403 | Active subscription required |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## 13. Pagination

All list endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 95,
    "per_page": 20,
    "has_next": true,
    "has_previous": false
  }
}
```

---

## 14. Localization

- All endpoints accept `Accept-Language` header: `en` or `ar`
- Text content is returned in both English and Arabic where applicable
- Date/time formats follow ISO 8601 standard
- Backend should handle RTL content appropriately

---

## 15. Push Notifications

### Device Token Registration
**Endpoint:** `POST /notifications/device-token`

**Headers:** Requires authentication

**Request:**
```json
{
  "device_token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "device_type": "ios",
  "device_model": "iPhone 14 Pro"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "device_id": 123,
    "registered_at": "2026-01-31T10:00:00Z"
  }
}
```

### Notification Types to Send:
1. **Daily Message** - New message available
2. **Goal Progress** - Milestone reached
3. **Subscription Expiry** - 7 days before expiry
4. **New Features** - App updates
5. **Streak Reminder** - Maintain reading streak

---

## 16. Analytics & Tracking

### Track User Activity
**Endpoint:** `POST /analytics/track`

**Headers:** Requires authentication

**Request:**
```json
{
  "event": "message_viewed",
  "properties": {
    "message_id": 1,
    "scope": "motivation",
    "duration_seconds": 30
  },
  "timestamp": "2026-01-31T10:00:00Z"
}
```

**Events to Track:**
- `message_viewed`
- `message_favorited`
- `message_shared`
- `message_rated`
- `goal_created`
- `goal_updated`
- `subscription_purchased`
- `topic_selected`

---

## 17. Rate Limiting

Implement rate limiting to prevent abuse:
- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **Message delivery**: 1000 requests per hour

Rate limit headers in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643640000
```

---

## 18. Webhooks (Optional)

For subscription management and payment processing:

### Webhook Events:
- `subscription.created`
- `subscription.renewed`
- `subscription.cancelled`
- `subscription.expired`
- `payment.succeeded`
- `payment.failed`

### Webhook Payload:
```json
{
  "event": "subscription.renewed",
  "data": {
    "subscription_id": 123,
    "user_id": 1,
    "package_id": 2,
    "start_date": "2026-02-01T00:00:00Z",
    "end_date": "2026-03-03T00:00:00Z"
  },
  "timestamp": "2026-02-01T00:00:00Z"
}
```

---

## 19. Testing Endpoints

### Health Check
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-01-31T10:00:00Z"
}
```

### Test Notification
**Endpoint:** `POST /test/notification`

**Headers:** Requires authentication (test users only)

**Request:**
```json
{
  "type": "daily_message",
  "device_token": "ExponentPushToken[xxx]"
}
```

---

## 20. Security Considerations

1. **HTTPS Only** - All API communication must use HTTPS
2. **Token Expiry** - Access tokens expire after 1 hour
3. **Refresh Tokens** - Refresh tokens expire after 30 days
4. **Password Requirements** - Minimum 8 characters, mix of letters and numbers
5. **Input Validation** - Sanitize all user inputs
6. **SQL Injection Prevention** - Use parameterized queries
7. **XSS Prevention** - Escape output data
8. **CORS** - Configure proper CORS headers
9. **Rate Limiting** - Implement rate limiting on all endpoints
10. **Audit Logging** - Log all authentication and sensitive operations

---

## 21. Development Tips

### Base Response Structure
All successful responses follow this structure:
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

All error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### HTTP Status Codes
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Support

For backend development questions or issues:
- Email: backend@yourapp.com
- Slack: #backend-api
- Documentation: https://docs.yourapp.com

---

**Version:** 1.0.0
**Last Updated:** January 31, 2026
