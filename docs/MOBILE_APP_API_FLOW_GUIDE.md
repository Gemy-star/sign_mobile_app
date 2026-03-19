# Mobile App API Flow Guide

Complete API integration guide for mobile app screens including onboarding, authentication, and main navigation.

**Base URL:** `http://<host>/api`

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
   - [Registration](#1-registration)
   - [Login](#2-login)
   - [Token Refresh](#3-token-refresh)
2. [Onboarding Flow](#onboarding-flow)
   - [Get Available Scopes](#1-get-available-scopes)
   - [Get Packages](#2-get-packages)
   - [Create Subscription](#3-create-subscription)
3. [Main App Screens](#main-app-screens)
   - [Scopes Tab](#scopes-tab)
   - [Messages Tab](#messages-tab)
   - [Profile Tab](#profile-tab)
4. [Complete Flow Example](#complete-flow-example)

---

## Authentication Flow

### 1. Registration

Create a new user account with automatic 7-day free trial.

**Endpoint:** `POST /api/auth/register/`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "password_confirm": "securepass123",
  "first_name": "John",
  "last_name": "Doe",
  "mobile_phone": "+1234567890",
  "country": "US",
  "date_of_birth": "1990-01-15",
  "start_trial": true
}
```

**Required Fields:**
- `username` (string) - Unique username
- `email` (string) - Unique email address
- `password` (string) - Minimum 8 characters
- `password_confirm` (string) - Must match password

**Optional Fields:**
- `first_name` (string)
- `last_name` (string)
- `mobile_phone` (string)
- `country` (string) - ISO 3166-1 alpha-2 code (US, EG, GB, etc.)
- `date_of_birth` (string) - Format: YYYY-MM-DD
- `start_trial` (boolean) - Default: true
- `role` (string) - normal | subscriber | admin (Default: normal)

**Response 201 - Success:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "role": "normal",
    "role_display": "Normal User",
    "mobile_phone": "+1234567890",
    "country": "US",
    "date_of_birth": "1990-01-15",
    "is_phone_verified": false,
    "has_active_trial": true,
    "trial_remaining_days": 7,
    "date_joined": "2026-03-14T10:00:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Response 400 - Validation Error:**
```json
{
  "username": ["A user with that username already exists."],
  "email": ["User with this email already exists."]
}
```

**What to do next:**
- Save both `access` and `refresh` tokens securely
- Use `access` token for all authenticated requests
- Redirect to onboarding/main app

---

### 2. Login

Authenticate existing user with username or email.

**Endpoint:** `POST /api/auth/login/`

**Alternative:** `POST /api/auth/token/` (Standard JWT format)

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john@example.com",
  "password": "securepass123"
}
```

**Note:** The `username` field accepts **both username and email**.

**Response 200 - Success:**
```json
{
  "message": "Login successful",
  "token": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "normal",
      "scopes": ["basic_profile"],
      "permissions": ["view_profile"],
      "has_active_trial": true,
      "trial_remaining_days": 5,
      "is_verified": false
    }
  },
  "user_info": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "normal",
    "full_name": "John Doe",
    "has_active_trial": true,
    "trial_remaining_days": 5,
    "scopes": ["basic_profile"],
    "permissions": ["view_profile"]
  }
}
```

**Response 400 - Invalid Credentials:**
```json
{
  "non_field_errors": ["Invalid credentials."]
}
```

**What to do next:**
- Save tokens securely
- Check `has_active_trial` - if true, user has free trial
- Redirect to main app

---

### 3. Token Refresh

Refresh expired access token using refresh token.

**Endpoint:** `POST /api/auth/refresh/`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response 200:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**When to use:**
- When API returns 401 Unauthorized
- Access tokens expire after 7 days
- Implement automatic refresh in your API client

---

## Onboarding Flow

After registration/login, guide users through selecting scopes and optionally subscribing to a package.

### 1. Get Available Scopes

Fetch all available life domains/categories.

**Endpoint:** `GET /api/scopes/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters (Optional):**
- `category` - Filter by: mental | physical | career | financial | relationships | spiritual | creativity | lifestyle

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Mindfulness",
    "category": "mental",
    "category_display": "Mental",
    "description": "Focus on mindfulness practices and mental clarity",
    "icon": "🧠",
    "is_active": true,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Fitness",
    "category": "physical",
    "category_display": "Physical",
    "description": "Physical health and wellness activities",
    "icon": "💪",
    "is_active": true,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

**What to display:**
- Show scopes grouped by category
- Allow multi-select (number limited by package)
- Display icons and descriptions

---

### 2. Get Packages

Fetch available subscription packages.

**Endpoint:** `GET /api/packages/`

**Alternative:** `GET /api/packages/featured/` (Featured only)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters (Optional):**
- `featured=true` - Return only featured packages

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Starter",
    "description": "Perfect for beginners exploring personal growth",
    "price": "9.99",
    "duration": "monthly",
    "duration_display": "Monthly",
    "duration_days": 30,
    "max_scopes": 3,
    "messages_per_day": 1,
    "custom_goals_enabled": false,
    "priority_support": false,
    "is_active": true,
    "is_featured": true,
    "display_order": 1,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "Professional",
    "description": "For dedicated personal development enthusiasts",
    "price": "24.99",
    "duration": "monthly",
    "duration_display": "Monthly",
    "duration_days": 30,
    "max_scopes": 8,
    "messages_per_day": 3,
    "custom_goals_enabled": true,
    "priority_support": true,
    "is_active": true,
    "is_featured": true,
    "display_order": 2,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

**What to display:**
- Package name and price
- Features (max_scopes, messages_per_day, custom_goals, priority_support)
- Duration
- Highlight featured packages

---

### 3. Create Subscription

Subscribe to a package and initiate payment.

**Endpoint:** `POST /api/subscriptions/`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "package_id": 1,
  "selected_scope_ids": [1, 2, 3],
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "redirect_url": "https://yourapp.com/payment/success",
  "post_url": "https://yourapp.com/api/payments/webhook/"
}
```

**Required Fields:**
- `package_id` (integer) - ID of selected package
- `selected_scope_ids` (array of integers) - Selected scope IDs (max determined by package)

**Optional Fields:**
- `customer_email` (string) - Defaults to user's email
- `customer_phone` (string)
- `redirect_url` (string) - Where to redirect after payment
- `post_url` (string) - Webhook URL for payment notifications

**Response 201:**
```json
{
  "subscription": {
    "id": 1,
    "user": 1,
    "package": 1,
    "status": "pending",
    "created_at": "2026-03-14T10:00:00Z"
  },
  "payment_url": "https://api.tap.company/v2/charges/chg_TS123..."
}
```

**What to do next:**
- Open `payment_url` in a web view or browser
- User completes payment on Tap Payment page
- After payment, webhook updates subscription status
- Poll subscription status or listen for webhook

---

## Main App Screens

### Scopes Tab

Display and manage user's selected scopes.

#### Get User's Active Subscription

**Endpoint:** `GET /api/subscriptions/active/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "id": 1,
  "user": 1,
  "package": {
    "id": 1,
    "name": "Starter",
    "max_scopes": 3,
    "messages_per_day": 1,
    "custom_goals_enabled": false
  },
  "selected_scopes": [
    {
      "id": 1,
      "name": "Mindfulness",
      "category": "mental",
      "icon": "🧠"
    },
    {
      "id": 2,
      "name": "Fitness",
      "category": "physical",
      "icon": "💪"
    }
  ],
  "status": "active",
  "start_date": "2026-03-01T00:00:00Z",
  "end_date": "2026-04-01T00:00:00Z",
  "is_active_status": true
}
```

**Response 404:**
```json
{
  "detail": "No active subscription found"
}
```

#### Get All Scopes

**Endpoint:** `GET /api/scopes/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** See [Onboarding Flow - Get Available Scopes](#1-get-available-scopes)

#### Update Selected Scopes

**Endpoint:** `PATCH /api/subscriptions/{id}/update_scopes/`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "scope_ids": [1, 3, 5]
}
```

**Response 200:**
```json
{
  "message": "Scopes updated successfully",
  "subscription": {
    "id": 1,
    "selected_scopes": [
      {"id": 1, "name": "Mindfulness"},
      {"id": 3, "name": "Career Growth"},
      {"id": 5, "name": "Financial Planning"}
    ]
  }
}
```

**What to display:**
- Grid/list of all available scopes
- Highlight user's selected scopes
- Show max_scopes limit from package
- Allow changing selections

---

### Messages Tab

Display AI-generated motivational messages.

#### Get All Messages

**Endpoint:** `GET /api/messages/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters (Optional):**
- `is_read=false` - Filter unread messages
- `is_favorited=true` - Filter favorited messages
- `message_type=daily` - Filter by type: daily | goal_specific | scope_based | custom

**Response 200:**
```json
[
  {
    "id": 1,
    "user": 1,
    "subscription": 1,
    "scope": 1,
    "scope_name": "Mindfulness",
    "goal": null,
    "goal_title": null,
    "message_type": "daily",
    "message_type_display": "Daily",
    "content": "Take a moment to breathe deeply and center yourself. Your mind is your most powerful tool - nurture it with kindness and patience.",
    "is_read": false,
    "is_favorited": false,
    "user_rating": null,
    "created_at": "2026-03-14T08:00:00Z"
  },
  {
    "id": 2,
    "user": 1,
    "subscription": 1,
    "scope": 2,
    "scope_name": "Fitness",
    "goal": 1,
    "goal_title": "Run 5K",
    "message_type": "goal_specific",
    "message_type_display": "Goal Specific",
    "content": "Consistency beats intensity. Even a short 15-minute workout brings you closer to your 5K goal. Lace up and get moving!",
    "is_read": true,
    "is_favorited": true,
    "user_rating": 5,
    "created_at": "2026-03-13T07:00:00Z"
  }
]
```

#### Get Today's Daily Message

**Endpoint:** `GET /api/messages/daily/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "id": 1,
  "message_type": "daily",
  "content": "Today is a gift. Focus on progress, not perfection.",
  "scope_name": "Mental",
  "is_read": false,
  "created_at": "2026-03-14T08:00:00Z"
}
```

**Note:** Auto-generates a daily message if one doesn't exist yet.

#### Generate New Message

**Endpoint:** `POST /api/messages/`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "scope_id": 1,
  "message_type": "scope_based",
  "custom_prompt": "Give me motivation for meditation"
}
```

**Fields:**
- `scope_id` (integer, optional) - Related scope
- `goal_id` (integer, optional) - Related goal
- `message_type` (string, required) - daily | goal_specific | scope_based | custom
- `custom_prompt` (string, optional) - Required for message_type=custom

**Response 201:**
```json
{
  "id": 3,
  "content": "Meditation is not about stopping thoughts, but observing them without judgment...",
  "message_type": "scope_based",
  "scope_name": "Mindfulness",
  "created_at": "2026-03-14T10:00:00Z"
}
```

**Response 429 - Limit Reached:**
```json
{
  "detail": "Daily message limit reached. Upgrade your plan for more messages."
}
```

#### Mark Message as Read

**Endpoint:** `POST /api/messages/{id}/mark_read/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "id": 1,
  "is_read": true
}
```

#### Toggle Favorite

**Endpoint:** `POST /api/messages/{id}/toggle_favorite/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "id": 1,
  "is_favorited": true
}
```

#### Rate Message

**Endpoint:** `POST /api/messages/{id}/rate/`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 5
}
```

**Rating:** Integer 1-5

**Response 200:**
```json
{
  "id": 1,
  "user_rating": 5
}
```

#### Get Favorited Messages

**Endpoint:** `GET /api/messages/favorites/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** Array of messages where `is_favorited: true`

**What to display:**
- Feed of messages (most recent first)
- Daily message prominently at top
- Favorite button for each message
- Star rating for feedback
- Generate new message button (respect daily limit)

---

### Profile Tab

Display user information and package details.

#### Get User Profile

**Endpoint:** `GET /api/auth/profile/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "John Doe",
  "role": "normal",
  "role_display": "Normal User",
  "mobile_phone": "+1234567890",
  "country": "US",
  "date_of_birth": "1990-01-15",
  "is_phone_verified": false,
  "trial_started_at": "2026-03-14T10:00:00Z",
  "trial_expires_at": "2026-03-21T10:00:00Z",
  "has_used_trial": true,
  "has_active_trial": true,
  "trial_remaining_days": 5,
  "date_joined": "2026-03-14T10:00:00Z"
}
```

#### Update Profile

**Endpoint:** `PATCH /api/auth/profile/`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "mobile_phone": "+9876543210",
  "country": "GB"
}
```

**Response 200:**
```json
{
  "id": 1,
  "username": "john_doe",
  "first_name": "Jane",
  "last_name": "Smith",
  "full_name": "Jane Smith"
}
```

#### Get Active Subscription Details

**Endpoint:** `GET /api/subscriptions/active/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "id": 1,
  "package": {
    "id": 1,
    "name": "Starter",
    "price": "9.99",
    "duration_display": "Monthly",
    "max_scopes": 3,
    "messages_per_day": 1,
    "custom_goals_enabled": false,
    "priority_support": false
  },
  "status": "active",
  "start_date": "2026-03-01T00:00:00Z",
  "end_date": "2026-04-01T00:00:00Z",
  "amount_paid": "9.99",
  "auto_renew": true
}
```

#### Get Subscription History

**Endpoint:** `GET /api/subscriptions/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
[
  {
    "id": 1,
    "package_name": "Starter",
    "status": "active",
    "start_date": "2026-03-01T00:00:00Z",
    "end_date": "2026-04-01T00:00:00Z",
    "amount_paid": "9.99",
    "created_at": "2026-03-01T00:00:00Z"
  },
  {
    "id": 2,
    "package_name": "Professional",
    "status": "expired",
    "start_date": "2026-02-01T00:00:00Z",
    "end_date": "2026-03-01T00:00:00Z",
    "amount_paid": "24.99",
    "created_at": "2026-02-01T00:00:00Z"
  }
]
```

#### Cancel Subscription

**Endpoint:** `POST /api/subscriptions/{id}/cancel/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "message": "Subscription cancelled successfully",
  "subscription": {
    "id": 1,
    "status": "cancelled",
    "cancelled_at": "2026-03-14T10:00:00Z"
  }
}
```

#### Get Dashboard Stats

**Endpoint:** `GET /api/dashboard/stats/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response 200:**
```json
{
  "total_messages": 45,
  "unread_messages": 3,
  "favorited_messages": 12,
  "active_goals": 5,
  "completed_goals": 2,
  "trial_status": {
    "has_active_trial": true,
    "trial_remaining_days": 5
  },
  "subscription_status": {
    "has_active_subscription": true,
    "package_name": "Starter",
    "messages_remaining_today": 0,
    "days_until_renewal": 17
  }
}
```

**What to display:**
- User's name, email, avatar
- Trial status (if applicable)
- Current package info
- Subscription end date
- Auto-renewal status
- Settings options (edit profile, cancel subscription)
- Subscription history

---

## Complete Flow Example

### First Time User Journey

```
1. App Launch
   └─> Check for saved access token
       ├─> Token exists → Validate token → Main App
       └─> No token → Login/Register Screen

2. Registration Screen
   └─> POST /api/auth/register/
       ├─> Success → Save tokens → Onboarding
       └─> Error → Show validation errors

3. Onboarding Screen 1: Select Scopes
   └─> GET /api/scopes/
       └─> Display scopes, allow selection
       └─> Next → Onboarding Screen 2

4. Onboarding Screen 2: Choose Package
   └─> GET /api/packages/featured/
       └─> Display packages
       ├─> Skip → Main App (trial mode)
       └─> Select Package → POST /api/subscriptions/
           └─> Open payment_url → Complete payment → Main App

5. Main App - Scopes Tab
   └─> GET /api/subscriptions/active/
       └─> Display selected scopes
       └─> Allow scope changes

6. Main App - Messages Tab
   └─> GET /api/messages/daily/
       └─> Display today's message
   └─> GET /api/messages/?is_read=false
       └─> Display recent messages
   └─> Actions: Read, Favorite, Rate, Generate New

7. Main App - Profile Tab
   └─> GET /api/auth/profile/
       └─> Display user info
   └─> GET /api/subscriptions/active/
       └─> Display package details
   └─> GET /api/dashboard/stats/
       └─> Display usage stats
```

### Returning User Journey

```
1. App Launch
   └─> Validate access token
       ├─> Valid → Main App
       └─> Expired → POST /api/auth/refresh/ → Main App

2. Main App Home Screen
   └─> GET /api/messages/daily/
       └─> Show daily message card
   └─> GET /api/messages/?is_read=false&limit=5
       └─> Show recent unread messages
   └─> GET /api/dashboard/stats/
       └─> Show stats summary

3. User Actions
   ├─> Tap message → Mark as read
   ├─> Favorite message → Toggle favorite
   ├─> Rate message → Submit rating
   ├─> Generate new → POST /api/messages/
   ├─> View profile → GET /api/auth/profile/
   └─> Change scopes → PATCH /subscriptions/{id}/update_scopes/
```

---

## Error Handling

### Common HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **204 No Content** - Successful deletion
- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Invalid/expired token
- **403 Forbidden** - Permission denied
- **404 Not Found** - Resource doesn't exist
- **429 Too Many Requests** - Rate limit exceeded

### Token Expiration Handling

When you receive a 401 response:

1. Try to refresh the token using `POST /api/auth/refresh/`
2. If refresh succeeds, retry the original request
3. If refresh fails, redirect to login

### Trial/Subscription Checks

Some endpoints require active subscription or trial:
- Messages endpoints
- Goals endpoints
- Some profile features

Response when no active subscription:
```json
{
  "detail": "Active subscription or trial required"
}
```

---

## Best Practices

### 1. Token Storage
- Store tokens in secure storage (Keychain on iOS, EncryptedSharedPreferences on Android)
- Never log tokens
- Clear tokens on logout

### 2. API Request Headers
Always include:
```
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json
```

### 3. Loading States
- Show loading indicators during API calls
- Handle network errors gracefully
- Implement retry logic for failed requests

### 4. Caching
- Cache non-sensitive data (scopes, packages)
- Refresh cache periodically
- Clear cache on logout

### 5. Pagination
- Use query parameters `?page=1&page_size=20` for large lists
- Implement infinite scroll for messages

### 6. Offline Support
- Cache messages for offline viewing
- Queue actions (favorite, rate) when offline
- Sync when connection restored

---

## Testing Endpoints

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@admin.com","password":"admin123456"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer <your_access_token>"
```

**Get Messages:**
```bash
curl -X GET http://localhost:8000/api/messages/ \
  -H "Authorization: Bearer <your_access_token>"
```

### Test Accounts

If seeded with test data:
- **Email:** admin@admin.com
- **Password:** admin123456

---

## Support

For API issues or questions:
- Check error messages in response body
- Verify token is valid and not expired
- Ensure all required fields are included
- Check subscription/trial status for protected endpoints

**Last Updated:** March 18, 2026
