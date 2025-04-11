# IntelliSearch Backend Documentation

## Project Overview
IntelliSearch is an AI-powered personalized search aggregator that enhances search results using Google Custom Search API and Google Gemini API.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Postman (for API testing)
- Google Custom Search API Key
- Google Gemini API Key

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/intellisearch
   JWT_SECRET=your_jwt_secret
   GOOGLE_CSE_API_KEY=your_google_cse_api_key
   GOOGLE_CSE_ID=your_google_cse_id
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Testing Guide (Postman)

### Authentication APIs

1. Register User
   - **URL**: `POST http://localhost:5000/api/auth/register`
   - **Body**:
     ```json
     {
         "username": "testuser",
         "email": "test@example.com",
         "password": "password123",
         "gender": "male"
     }
     ```
   - **Expected Response**:
     ```json
     {
         "success": true,
         "user": {
             "username": "testuser",
             "email": "test@example.com",
             "gender": "male",
             "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=male"
         },
         "token": "jwt_token_here"
     }
     ```

2. Login User
   - **URL**: `POST http://localhost:5000/api/auth/login`
   - **Body**:
     ```json
     {
         "email": "test@example.com",
         "password": "password123"
     }
     ```
   - **Expected Response**:
     ```json
     {
         "success": true,
         "user": {
             "username": "testuser",
             "email": "test@example.com"
         },
         "token": "jwt_token_here"
     }
     ```

### Search APIs

1. Perform Search
   - **URL**: `POST http://localhost:5000/api/search`
   - **Headers**: 
     - `Authorization: Bearer your_jwt_token`
   - **Body**:
     ```json
     {
         "query": "artificial intelligence",
         "filters": {
             "safeSearch": true,
             "language": "en",
             "region": "US"
         }
     }
     ```
   - **Expected Response**:
     ```json
     {
         "success": true,
         "results": [
             {
                 "title": "What is Artificial Intelligence?",
                 "link": "https://example.com/ai",
                 "snippet": "Artificial Intelligence is...",
                 "summary": "AI is the simulation of human intelligence...",
                 "category": "Technology",
                 "relevance": 8
             }
         ],
         "metadata": {
             "totalResults": 10,
             "searchTime": 1.5
         }
     }
     ```

2. Get Search History
   - **URL**: `GET http://localhost:5000/api/search/history`
   - **Headers**: 
     - `Authorization: Bearer your_jwt_token`
   - **Expected Response**:
     ```json
     {
         "success": true,
         "searches": [
             {
                 "_id": "search_id",
                 "query": "artificial intelligence",
                 "timestamp": "2024-04-11T10:00:00Z",
                 "resultsCount": 10
             }
         ]
     }
     ```

### User Preferences APIs

1. Get User Preferences
   - **URL**: `GET http://localhost:5000/api/user/preferences`
   - **Headers**: 
     - `Authorization: Bearer your_jwt_token`
   - **Expected Response**:
     ```json
     {
         "success": true,
         "preferences": {
             "defaultEngine": "google",
             "resultsPerPage": 10,
             "safeSearch": true,
             "language": "en",
             "region": "US"
         }
     }
     ```

2. Update User Preferences
   - **URL**: `PUT http://localhost:5000/api/user/preferences`
   - **Headers**: 
     - `Authorization: Bearer your_jwt_token`
   - **Body**:
     ```json
     {
         "preferences": {
             "resultsPerPage": 20,
             "safeSearch": false,
             "language": "en",
             "region": "UK"
         }
     }
     ```
   - **Expected Response**:
     ```json
     {
         "success": true,
         "preferences": {
             "defaultEngine": "google",
             "resultsPerPage": 20,
             "safeSearch": false,
             "language": "en",
             "region": "UK"
         }
     }
     ```

### Saved Searches APIs

1. Save Search Result
   - **URL**: `POST http://localhost:5000/api/search/save`
   - **Headers**: 
     - `Authorization: Bearer your_jwt_token`
   - **Body**:
     ```json
     {
         "searchId": "search_id",
         "resultId": "result_id"
     }
     ```
   - **Expected Response**:
     ```json
     {
         "success": true,
         "message": "Search result saved successfully"
     }
     ```

2. Get Saved Searches
   - **URL**: `GET http://localhost:5000/api/search/saved`
   - **Headers**: 
     - `Authorization: Bearer your_jwt_token`
   - **Expected Response**:
     ```json
     {
         "success": true,
         "savedSearches": [
             {
                 "_id": "saved_id",
                 "title": "What is AI?",
                 "link": "https://example.com/ai",
                 "savedAt": "2024-04-11T10:00:00Z"
             }
         ]
     }
     ```

### Search Statistics APIs

1. Get Search Statistics
   - **URL**: `GET http://localhost:5000/api/search/stats`
   - **Headers**: 
     - `Authorization: Bearer your_jwt_token`
   - **Expected Response**:
     ```json
     {
         "success": true,
         "statistics": {
             "totalSearches": 50,
             "mostSearched": [
                 {
                     "query": "artificial intelligence",
                     "count": 10
                 }
             ],
             "recentSearches": [
                 {
                     "query": "machine learning",
                     "timestamp": "2024-04-11T10:00:00Z"
                 }
             ],
             "searchCategories": [
                 {
                     "category": "Technology",
                     "count": 30
                 }
             ],
             "averageSearchTime": 1.5
         }
     }
     ```

## Testing Notes
1. Make sure MongoDB is running
2. Set up environment variables in `.env` file
3. Start the server using `npm start`
4. Use Postman to test each API endpoint
5. For authenticated routes, copy the JWT token from login/register response and add it to request headers
6. Test each endpoint with both valid and invalid data to ensure proper error handling

## Common Error Responses
```json
{
    "success": false,
    "error": "Error message here"
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## API Documentation

### 1. User Registration
- **URL**: `POST /api/auth/register`
- **Description**: Register a new user
- **Request**:
  ```json
  {
      "username": "testuser",
      "email": "test@example.com",
      "password": "password123",
      "gender": "male"
  }
  ```
- **Response**:
  ```json
  {
      "success": true,
      "user": {
          "username": "testuser",
          "email": "test@example.com",
          "gender": "male",
          "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=male"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 2. User Login
- **URL**: `POST /api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Request**:
  ```json
  {
      "email": "test@example.com",
      "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
      "success": true,
      "user": {
          "username": "testuser",
          "email": "test@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 3. Perform Search
- **URL**: `POST /api/search`
- **Description**: Perform a search with filters
- **Request**:
  ```json
  {
      "query": "artificial intelligence",
      "filters": {
          "safeSearch": true,
          "language": "en",
          "region": "US"
      }
  }
  ```
- **Response**:
  ```json
  {
      "success": true,
      "results": [
          {
              "title": "What is Artificial Intelligence?",
              "link": "https://example.com/ai",
              "snippet": "Artificial Intelligence is the simulation of human intelligence...",
              "summary": "AI is a branch of computer science that focuses on creating intelligent machines...",
              "category": "Technology",
              "relevance": 8
          }
      ],
      "metadata": {
          "totalResults": 10,
          "searchTime": 1.5
      }
  }
  ```

### 4. Get Search History
- **URL**: `GET /api/search/history`
- **Description**: Get user's search history
- **Response**:
  ```json
  {
      "success": true,
      "searches": [
          {
              "_id": "67f8baea32aeb35a2c0939e7",
              "query": "artificial intelligence",
              "timestamp": "2024-04-11T10:00:00Z",
              "resultsCount": 10
          }
      ]
  }
  ```

### 5. Delete Search History
- **URL**: `DELETE /api/search/history/:id`
- **Description**: Delete specific search history entry
- **Response**:
  ```json
  {
      "success": true,
      "message": "Search history deleted successfully"
  }
  ```

### 6. Get User Preferences
- **URL**: `GET /api/user/preferences`
- **Description**: Get user's search preferences
- **Response**:
  ```json
  {
      "success": true,
      "preferences": {
          "defaultEngine": "google",
          "resultsPerPage": 10,
          "safeSearch": true,
          "language": "en",
          "region": "US"
      }
  }
  ```

### 7. Update User Preferences
- **URL**: `PUT /api/user/preferences`
- **Description**: Update user's search preferences
- **Request**:
  ```json
  {
      "preferences": {
          "resultsPerPage": 20,
          "safeSearch": false,
          "language": "en",
          "region": "UK"
      }
  }
  ```
- **Response**:
  ```json
  {
      "success": true,
      "preferences": {
          "defaultEngine": "google",
          "resultsPerPage": 20,
          "safeSearch": false,
          "language": "en",
          "region": "UK"
      }
  }
  ```

### 8. Save Search Result
- **URL**: `POST /api/search/save`
- **Description**: Save a search result
- **Request**:
  ```json
  {
      "searchId": "67f8baea32aeb35a2c0939e7",
      "resultId": 0
  }
  ```
- **Response**:
  ```json
  {
      "success": true,
      "message": "Search result saved successfully",
      "savedSearch": {
          "_id": "67f8bca59ce6f06632d7f248",
          "title": "What is Artificial Intelligence?",
          "link": "https://example.com/ai",
          "savedAt": "2024-04-11T10:00:00Z"
      }
  }
  ```

### 9. Get Saved Searches
- **URL**: `GET /api/search/saved`
- **Description**: Get all saved searches
- **Response**:
  ```json
  {
      "success": true,
      "savedSearches": [
          {
              "_id": "67f8bca59ce6f06632d7f248",
              "title": "What is Artificial Intelligence?",
              "link": "https://example.com/ai",
              "snippet": "Artificial Intelligence is...",
              "summary": "AI is the simulation of human intelligence...",
              "category": "Technology",
              "savedAt": "2024-04-11T10:00:00Z"
          }
      ]
  }
  ```

### 10. Enhance Search Results
- **URL**: `POST /api/search/enhance`
- **Description**: Enhance search results with AI
- **Request**:
  ```json
  {
      "results": [
          {
              "title": "What is Artificial Intelligence?",
              "snippet": "Artificial Intelligence is the simulation of human intelligence..."
          }
      ]
  }
  ```
- **Response**:
  ```json
  {
      "success": true,
      "enhancedResults": [
          {
              "summary": "Artificial Intelligence (AI) is a branch of computer science that focuses on creating intelligent machines capable of performing tasks that typically require human intelligence...",
              "category": "Technology",
              "relevance": 9
          }
      ]
  }
  ```

### 11. Get Search Suggestions
- **URL**: `GET /api/search/suggestions?query=artificial`
- **Description**: Get search suggestions based on query
- **Response**:
  ```json
  {
      "success": true,
      "suggestions": [
          "artificial intelligence",
          "artificial neural networks",
          "artificial general intelligence",
          "artificial intelligence applications",
          "artificial intelligence in healthcare"
      ]
  }
  ```

### 12. Get Search Statistics
- **URL**: `GET /api/search/stats`
- **Description**: Get user's search statistics
- **Response**:
  ```json
  {
      "success": true,
      "statistics": {
          "totalSearches": 50,
          "mostSearched": [
              {
                  "query": "artificial intelligence",
                  "count": 10
              }
          ],
          "recentSearches": [
              {
                  "query": "machine learning",
                  "timestamp": "2024-04-11T10:00:00Z"
              }
          ],
          "searchCategories": [
              {
                  "category": "Technology",
                  "count": 30
              }
          ],
          "averageSearchTime": 1.5
      }
  }
  ```

## Development Progress Tracking

### Phase 1: Authentication (Week 1)
- [✅] Set up project structure
- [✅] Implement user registration
- [✅] Implement user login
- [✅] Implement JWT authentication
- [ ] Test authentication endpoints

### Phase 2: Search Integration (Week 2)
- [✅] Set up Google Custom Search API
- [✅] Implement basic search functionality
- [✅] Set up Gemini API
- [✅] Implement search enhancement
- [ ] Test search endpoints

### Phase 3: Search History & Preferences (Week 3)
- [✅] Implement search history storage
- [✅] Implement user preferences
- [✅] Implement saved searches
- [ ] Test history and preferences endpoints

### Phase 4: Enhancement & Statistics (Week 4)
- [✅] Implement search enhancement with Gemini
- [✅] Implement search statistics
- [ ] Optimize search performance
- [ ] Test all endpoints

## Technology Stack
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Google Custom Search API
- Google Gemini API

## API Keys Configuration
(To be added as development progresses)

## Testing
(To be added as development progresses)

## Deployment
(To be added as development progresses)
