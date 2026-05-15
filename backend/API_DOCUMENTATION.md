# Pragyan Backend API Documentation

Complete API reference for Pragyan Backend with examples and response formats.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require Bearer token:

```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. Register User

**Endpoint**: `POST /auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules**:
- fullName: 2-100 characters
- email: Valid email format
- password: Minimum 6 characters

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clpxyz123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- 400: Email already registered
- 400: Validation failed

---

### 2. Login

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clpxyz123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- 401: Invalid email or password

---

### 3. Get Current User

**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer <token>` ⭐ Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "clpxyz123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "USER",
    "selectedCareer": "Software Engineer",
    "skillLevel": "intermediate",
    "xp": 1250,
    "streak": 5,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 4. Refresh Access Token

**Endpoint**: `POST /auth/refresh-token`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:
- 401: Invalid or expired refresh token

---

### 5. Logout

**Endpoint**: `POST /auth/logout`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {}
}
```

---

## Roadmap Endpoints

### 1. Get All Roadmaps

**Endpoint**: `GET /roadmaps`

**Query Parameters**:
```
page=1
limit=10
query=react (optional)
category=frontend (optional)
level=beginner (optional)
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "roadmap123",
      "title": "React Fundamentals",
      "category": "frontend",
      "description": "Master React.js...",
      "level": "beginner",
      "duration": "6 weeks",
      "icon": "⚛️",
      "estimatedHours": 48,
      "tags": ["javascript", "react", "frontend"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### 2. Get Single Roadmap

**Endpoint**: `GET /roadmaps/:id`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "roadmap123",
    "title": "React Fundamentals",
    "category": "frontend",
    "description": "Master React.js...",
    "level": "beginner",
    "duration": "6 weeks",
    "icon": "⚛️",
    "estimatedHours": 48,
    "tags": ["javascript", "react"],
    "weeks": [
      {
        "id": "week1",
        "weekNumber": 1,
        "title": "React Basics",
        "days": [
          {
            "id": "day1",
            "dayNumber": 1,
            "title": "Setup & Components",
            "tasks": [
              {
                "id": "task1",
                "title": "Setup React project",
                "xp": 10,
                "estimatedTime": 30
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

### 3. Search Roadmaps

**Endpoint**: `GET /roadmaps/search`

**Query Parameters**:
```
q=python (required)
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Search results fetched",
  "data": [
    {
      "id": "roadmap456",
      "title": "Python for Beginners",
      "category": "programming-languages",
      "description": "...",
      "level": "beginner"
    }
  ]
}
```

---

### 4. Get Roadmaps by Category

**Endpoint**: `GET /roadmaps/category/:category`

**Query Parameters**:
```
page=1
limit=10
```

**Success Response** (200):
```json
{
  "success": true,
  "data": [],
  "pagination": { ... }
}
```

---

### 5. Get All Categories

**Endpoint**: `GET /roadmaps/categories`

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    "frontend-development",
    "backend-development",
    "ai-ml",
    "data-science",
    "devops",
    "cyber-security"
  ]
}
```

---

### 6. Create Roadmap (Admin)

**Endpoint**: `POST /roadmaps`

**Headers**: `Authorization: Bearer <admin_token>` ⭐ Required (ADMIN role)

**Request Body**:
```json
{
  "title": "Node.js Advanced",
  "category": "backend",
  "description": "Advanced Node.js concepts...",
  "level": "advanced",
  "duration": "8 weeks",
  "icon": "🟢",
  "estimatedHours": 64,
  "tags": ["nodejs", "backend", "javascript"]
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Roadmap created successfully",
  "data": { ... }
}
```

---

### 7. Update Roadmap (Admin)

**Endpoint**: `PUT /roadmaps/:id`

**Headers**: `Authorization: Bearer <admin_token>` ⭐ Required

**Request Body**: Same as create

**Success Response** (200):
```json
{
  "success": true,
  "message": "Roadmap updated successfully",
  "data": { ... }
}
```

---

### 8. Delete Roadmap (Admin)

**Endpoint**: `DELETE /roadmaps/:id`

**Headers**: `Authorization: Bearer <admin_token>` ⭐ Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Roadmap deleted successfully",
  "data": {}
}
```

---

## Progress Tracking Endpoints

### 1. Get Progress

**Endpoint**: `GET /progress/:roadmapId`

**Headers**: `Authorization: Bearer <token>` ⭐ Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Progress fetched successfully",
  "data": {
    "id": "progress123",
    "userId": "user123",
    "roadmapId": "roadmap123",
    "completedTasks": ["task1", "task2"],
    "completedDays": ["day1"],
    "progressPercentage": 25.5,
    "currentDay": 2,
    "xp": 50,
    "streak": 3,
    "lastActiveDate": "2024-01-20T15:30:00Z"
  }
}
```

---

### 2. Complete Task

**Endpoint**: `POST /progress/complete-task`

**Headers**: `Authorization: Bearer <token>` ⭐ Required

**Request Body**:
```json
{
  "roadmapId": "roadmap123",
  "taskId": "task1"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Task completed successfully",
  "data": {
    "id": "progress123",
    "progressPercentage": 28.5,
    "currentDay": 2,
    "xp": 60,
    "completedTasks": ["task1", "task2", "task3"],
    "lastActiveDate": "2024-01-20T15:35:00Z"
  }
}
```

---

### 3. Get Dashboard

**Endpoint**: `GET /progress/user/dashboard`

**Headers**: `Authorization: Bearer <token>` ⭐ Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully",
  "data": {
    "user": {
      "id": "user123",
      "fullName": "John Doe",
      "xp": 1250,
      "streak": 5
    },
    "progress": [
      {
        "roadmapId": "roadmap123",
        "progressPercentage": 45.5,
        "currentDay": 8,
        "xp": 350
      }
    ],
    "completedRoadmaps": [
      {
        "roadmapId": "roadmap456",
        "completedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "stats": {
      "totalRoadmapsStarted": 3,
      "totalRoadmapsCompleted": 1,
      "totalXp": 1250,
      "currentStreak": 5
    }
  }
}
```

---

### 4. Complete Roadmap

**Endpoint**: `POST /progress/complete-roadmap`

**Headers**: `Authorization: Bearer <token>` ⭐ Required

**Request Body**:
```json
{
  "roadmapId": "roadmap123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Roadmap marked as completed",
  "data": {
    "id": "completed123",
    "userId": "user123",
    "roadmapId": "roadmap123",
    "completedAt": "2024-01-20T15:40:00Z"
  }
}
```

---

## Assessment Endpoints

### 1. Get Questions

**Endpoint**: `GET /assessment/questions`

**Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "q1",
      "question": "Do you enjoy coding?",
      "options": ["Yes", "No", "Maybe"],
      "category": "general"
    }
  ]
}
```

---

### 2. Submit Assessment

**Endpoint**: `POST /assessment/submit`

**Headers**: `Authorization: Bearer <token>` ⭐ Required

**Request Body**:
```json
{
  "answers": {
    "q1": "Yes",
    "q2": "Yes",
    "q3": "No",
    "q4": "Yes",
    "q5": "Maybe"
  }
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Assessment submitted successfully",
  "data": {
    "id": "result123",
    "userId": "user123",
    "suggestedCareers": ["Software Engineer", "Data Scientist"],
    "scores": {
      "Software Engineer": 85,
      "Data Scientist": 75
    },
    "strengths": ["Problem Solving", "Logical Thinking"],
    "weaknesses": ["Communication"],
    "createdAt": "2024-01-20T15:45:00Z"
  }
}
```

---

### 3. Get Assessment Result

**Endpoint**: `GET /assessment/result/:resultId`

**Headers**: `Authorization: Bearer <token>` ⭐ Required

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "result123",
    "userId": "user123",
    "suggestedCareers": ["Software Engineer"],
    "scores": { ... },
    "strengths": [],
    "weaknesses": []
  }
}
```

---

## AI Recommendation Endpoints

### 1. Get Career Recommendations

**Endpoint**: `GET /ai/recommend-careers`

**Headers**: `Authorization: Bearer <token>` ⭐ Required

**Success Response** (200):
```json
{
  "success": true,
  "message": "Career recommendations fetched",
  "data": [
    {
      "career": "Software Engineer",
      "score": 94,
      "reason": "Strong logical thinking and problem-solving skills"
    },
    {
      "career": "Data Scientist",
      "score": 87,
      "reason": "Excellent analytical abilities"
    },
    {
      "career": "AI Engineer",
      "score": 82,
      "reason": "Interest in machine learning"
    }
  ]
}
```

---

### 2. Get Recommended Roadmaps for Career

**Endpoint**: `GET /ai/roadmaps/:career`

**Example**: `/ai/roadmaps/Software%20Engineer`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Recommended roadmaps fetched",
  "data": [
    {
      "id": "roadmap123",
      "title": "React Fundamentals",
      "category": "frontend",
      "level": "beginner"
    }
  ]
}
```

---

### 3. Get Personalized Roadmap

**Endpoint**: `POST /ai/personalized-roadmap`

**Headers**: `Authorization: Bearer <token>` ⭐ Required

**Request Body**:
```json
{
  "careerGoal": "Software Engineer",
  "skillLevel": "beginner"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Personalized roadmaps generated",
  "data": [
    {
      "id": "roadmap123",
      "title": "HTML & CSS Fundamentals",
      "category": "frontend",
      "level": "beginner",
      "duration": "4 weeks"
    }
  ]
}
```

---

## Error Handling

### Common Error Responses

**400 - Bad Request**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

**401 - Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid or expired access token"
}
```

**403 - Forbidden**:
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**404 - Not Found**:
```json
{
  "success": false,
  "message": "User not found"
}
```

**409 - Conflict**:
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**500 - Internal Server Error**:
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes per IP
- **Other endpoints**: 100 requests per 15 minutes per IP
- **Response headers**: Include X-RateLimit-* headers

---

## Status Codes

- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **400**: Bad Request - Invalid input
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource conflict
- **500**: Internal Server Error - Server error

---

## Testing with cURL

### Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Test123"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:5000/api/auth/me \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Postman Collection

Import this to Postman for easy testing: [See attached collection.json]

---

**API Version**: 1.0.0  
**Last Updated**: 2024-01-20
