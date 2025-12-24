# Blogging Website API Documentation

## Overview
A simple blogging backend API. Users can register, login, create posts, write comments, and like posts. Built with Express.js and Prisma ORM.

**Base URL:** `http://localhost:3000/api`

---

## Technology Stack

### Backend Framework
- **Express.js v5.2.1** - Web server framework
- **Node.js with Bun and Node** - JavaScript runtime

### Database & ORM
- **PostgreSQL** - Relational database (via DATABASE_URL)
- **Prisma v5.22.0** - ORM for database operations
- **Prisma Client** - Query builder and type safety

### Authentication & Security
- **JWT (jsonwebtoken v9.0.3)** - Token-based authentication
- **bcryptjs v3.0.3** - Password hashing
- **Helmet v8.1.0** - HTTP security headers
- **cookie-parser v1.4.7** - Cookie handling
- **CORS v2.8.5** - Cross-Origin Resource Sharing
- **express-rate-limit v8.2.1** - Rate limiting protection

### Input Validation & Sanitization
- **Zod v4.1.13** - Schema validation library
- **sanitize-html v2.17.0** - HTML sanitization to prevent XSS

### Logging & Monitoring
- **Morgan v1.10.1** - HTTP request logger
- **Winston v3.19.0** - Application logging

### Development Tools
- **Nodemon v3.1.11** - Auto-restart on file changes
- **@faker-js/faker v10.1.0** - Fake data generation for seeding

### Environment Management
- **dotenv v17.2.3** - Environment variables loader

---

## Database Schema

### User Model
```
- id: UUID (Primary Key)
- firstName: String (required, 2+ chars)
- lastName: String (required, 2+ chars)
- username: String (unique, required, 3+ chars)
- email: String (unique, required, valid email)
- password: String (hashed with bcrypt, 8+ chars)
- role: Enum (USER or ADMIN, default: USER)
- created_at: DateTime
- updated_at: DateTime
- Relations: posts, comments, likes
```

### Post Model
```
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- title: String (optional, max 200 chars)
- content: String (required, min 12 chars)
- created_at: DateTime
- updated_at: DateTime
- Relations: user, comments, likes
```

### Comment Model
```
- id: UUID (Primary Key)
- post_id: UUID (Foreign Key)
- user_id: UUID (Foreign Key)
- text: String (required, min 1 char)
- created_at: DateTime
- Relations: post, user
```

### Like Model
```
- id: UUID (Primary Key)
- post_id: UUID (Foreign Key)
- user_id: UUID (Foreign Key)
- created_at: DateTime
- Constraint: Unique pair of (post_id, user_id) - one like per user per post
- Relations: post, user
```

---

## Middleware Stack

### Security Middleware
- **Helmet** - Sets various HTTP headers (X-Frame-Options, X-XSS-Protection, etc.)
- **CORS** - Allows requests from 192.168.1.103 with GET, POST, PUT, PATCH, DELETE methods
- **Rate Limiter** - Global limit: 100 req/15min; Auth limit: 10 req/hour

### Authentication Middleware
- **authMiddleware** - Checks token in Authorization header or jwt cookie
  - Verifies JWT signature with JWT_SECRET
  - Looks up user in database
  - Attaches user object to req.user or sets to null if not authenticated
  - Optional auth (non-protected routes still work)

- **isLoginMiddleware** - Requires user to be authenticated
  - Returns 401 if req.user is null
  - Used for routes that require login

- **isPostOwner** - Checks if user owns the post
  - Compares req.user.id with post's user_id
  - Returns 403 if not owner

- **isCommentOwner** - Checks if user owns the comment
  - Used before deleting comments

- **isAdmin** - Checks if user role is ADMIN
  - Used for admin routes

### Logging Middleware
- **Morgan** - Logs HTTP requests in dev/production format

### Input Processing Middleware
- **express.json()** - Parses JSON bodies
- **express.urlencoded()** - Parses form data
- **cookie-parser** - Parses cookies

### Validation & Sanitization
- **validate()** - Validates request body using Zod schemas
  - Returns 400 with validation errors if invalid
  - Catches duplicate username/email errors

- **sanitizeInput** - Removes HTML tags from post content
  - Prevents XSS attacks
  - Used on POST and PATCH for posts

### Error Handler Middleware
- **errorHandler** - Global error handler
  - Catches all errors and formats responses
  - Sends appropriate HTTP status codes

---

## Authentication Details

### Token Generation & Storage
- When user registers or logs in, server calls `generateToken(user, res)`
- **Token Creation:**
  - Payload contains: `{ id, username, email, role }`
  - Signed with `JWT_SECRET` from environment
  - Expires in `JWT_EXPIRES_IN` (default: 7 days)
  - Uses HS256 algorithm

- **Token Storage:**
  - Returned in response as `token` (client can store in localStorage/sessionStorage)
  - Also set as HTTP-only cookie `jwt` with:
    - `httpOnly: true` (not accessible from JavaScript, prevents XSS)
    - `secure: true` (in production, only sent over HTTPS)
    - `sameSite: strict` (CSRF protection)
    - `maxAge: 604800000` (7 days in milliseconds)

### Authentication Flow
1. Client sends credentials (username + password)
2. Server verifies password with bcrypt.compare()
3. Server generates JWT token and sets cookie
4. Server returns token in response body
5. Client can use token in header: `Authorization: Bearer TOKEN`
6. For subsequent requests, authMiddleware checks:
   - Bearer token in Authorization header, OR
   - JWT cookie from browser
7. JWT is verified with secret key
8. User record is fetched from database
9. `req.user` is populated with `{ id, username, role }`

### Password Security
- Passwords are hashed using bcryptjs with salt rounds: 10
- Passwords are never returned in API responses
- Original password is never stored

---

## User Routes

### 1. Register (Create new user)
**Route:** `POST /users/register`  
**Auth Required:** No (rate limited - 10 per hour per IP)  
**Validation:** Zod schema checks:
- firstName: min 2 characters
- lastName: min 2 characters
- username: min 3 characters, must be unique
- email: valid email format, must be unique
- password: min 8 characters

**Send:**
```json
{
  "firstName": "Ali",
  "lastName": "Khan",
  "username": "ali",
  "email": "ali@example.com",
  "password": "secret123"
}
```
**Get Back:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-id-123",
      "username": "ali",
      "email": "ali@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. Login (Get token)
**Route:** `POST /users/login`  
**Auth Required:** No (rate limited - 10 per hour per IP)  
**Validation:** Zod schema checks:
- username: min 3 characters, must exist
- password: min 8 characters, must match hashed value in database

**Send:**
```json
{
  "username": "ali",
  "password": "secret123"
}
```
**Get Back:** Same as register (user + token)

### 3. Get Current User (View own profile)
**Route:** `GET /users/me`  
**Auth Required:** Yes (must be logged in via isLoginMiddleware)  
**Send:** Nothing (only pass token in header or cookie)  
**Get Back:**
```json
{
  "status": "success",
  "data": {
    "id": "user-id-123",
    "firstName": "Ali",
    "lastName": "Khan",
    "username": "ali",
    "email": "ali@example.com",
    "created_at": "2025-12-24T10:00:00Z",
    "role": "user"
  }
}
```

### 4. Update User (Edit profile)
**Route:** `PATCH /users/me`  
**Auth Required:** Yes (must be logged in)  
**Validation:** All fields are optional, but if provided:
- firstName: min 2 characters
- lastName: min 2 characters
- username: min 3 characters, must be unique
- email: valid email format, must be unique

**Send:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Khan",
  "username": "ahmed",
  "email": "ahmed@example.com"
}
```
**Get Back:** Updated user object

### 5. Search Users (Find users)
**Route:** `GET /users?search=ali&page=1&limit=15`  
**Auth Required:** Yes (requires authMiddleware, no isLoginMiddleware check - req.user can be null and still works)  
**Query Parameters:**
- `search` (optional): Search by username, firstName, or lastName (case-insensitive)
- `page` (optional): Page number (default 1)
- `limit` (optional): Results per page (default 15)
- Returns: Pagination metadata with totalUsers, totalPages, current page, limit

**Get Back:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "user-id",
      "username": "ali",
      "firstName": "Ali",
      "lastName": "Khan",
      "created_at": "2025-12-24T10:00:00Z"
    }
  ],
  "pagination": {
    "totalUsers": 5,
    "totalPages": 1,
    "current": 1,
    "limit": 15
  }
}
```

### 6. Logout (End session)
**Route:** `GET /users/logout`  
**Auth Required:** No  
**Action:** Clears the `jwt` cookie by setting expiration to date(0)  
**Send:** Nothing  
**Get Back:**
```json
{
  "status": "success",
  "message": "logout successfully"
}
```

---

## Post Routes

### 1. Get All Posts (View all posts)
**Route:** `GET /posts`  
**Auth Required:** Yes (uses authMiddleware - optional auth)  
**Query Parameters:** page, limit (optional)  
**Returns:** Array of posts with pagination, only returns content (no nested comments/likes)

### 2. Create Post (Write new post)
**Route:** `POST /posts`  
**Auth Required:** Yes (must be logged in via isLoginMiddleware)  
**Validation:** Zod schema checks:
- title: optional, max 200 characters
- content: required, min 12 characters

**Sanitization:** HTML is stripped from content using sanitize-html middleware
**Send:**
```json
{
  "title": "My First Post",
  "content": "This is a great post content with minimum 12 characters"
}
```
**Note:** Title is optional, content is required (minimum 12 characters, maximum 200 for title).
**Get Back:**
```json
{
  "status": "success",
  "data": {
    "id": "post-id-123",
    "title": "My First Post",
    "content": "This is a great post content...",
    "created_at": "2025-12-24T10:00:00Z",
    "user_id": "user-id-123"
  }
}
```

### 3. Get Single Post (View one post)
**Route:** `GET /posts/:postId`  
**Auth:** No  
**Send:** Nothing (postId in URL)  
**Get Back:** Complete post object

### 4. Update Post (Edit post)
**Route:** `PATCH /posts/:postId`  
**Auth:** Yes + Must be post owner  
**Send:** Same as create (title, content, tags)  
**Get Back:** Updated post

### 5. Delete Post (Remove post)
**Route:** `DELETE /posts/:postId`  
**Auth:** Yes + Must be post owner  
**Send:** Nothing  
**Get Back:**
```json
{
  "status": "success",
  "message": "Post deleted"
}
```

---

## Comment Routes (Attached to posts)

### 1. Add Comment (Write comment on post)
**Route:** `POST /posts/:postId/comments`  
**Auth Required:** Yes (must be logged in)  
**Validation:** Zod schema checks:
- text: required, min 1 character

**Send:**
```json
{
  "text": "Great post!"
}
```
**Get Back:**
```json
{
  "status": "success",
  "data": {
    "id": "comment-id-123",
    "post_id": "post-id-123",
    "user_id": "user-id-123",
    "text": "Great post!",
    "created_at": "2025-12-24T10:00:00Z"
  }
}
```

### 2. Get Comments (View post comments)
**Route:** `GET /posts/:postId/comments`  
**Auth Required:** No (public endpoint)  
**Returns:** Array of comments for the post

### 3. Delete Comment (Remove your comment)
**Route:** `DELETE /posts/:postId/comments/:commentId`  
**Auth Required:** Yes (isCommentOwner middleware - only comment author can delete)  
**Send:** Nothing  
**Get Back:**
```json
{
  "status": "success",
  "message": "Comment deleted"
}
```

---

## Like Routes (Attached to posts)

### 1. Like Post (Add like to post)
**Route:** `POST /posts/:postId/like`  
**Auth Required:** Yes (must be logged in)  
**Constraint:** Unique constraint on (post_id, user_id) - user can only like once per post
**Send:** Nothing  
**Get Back:**
```json
{
  "status": "success",
  "data": {
    "id": "like-id-123",
    "post_id": "post-id-123",
    "user_id": "user-id-123",
    "created_at": "2025-12-24T10:00:00Z"
  }
}
```

### 2. Unlike Post (Remove like)
**Route:** `POST /posts/:postId/like`  
**Auth Required:** Yes  
**Action:** Removes the like record if user has liked this post
**Send:** Nothing  

---

## User Stats (View profile statistics)

### Get User Stats
**Route:** `GET /users/me/stats`  
**Auth Required:** Yes (must be logged in)  
**Returns:** Count of user's posts, comments, and likes received
**Get Back:**
```json
{
  "status": "success",
  "data": {
    "likesReceivedLast30Days": 11,
    "commentsReceivedLast30Days": 19,
    "postsCreatedLast30Days": 51
  }
}
```

---

## Error Responses

### Error Format
All errors follow this consistent JSON format:
```json
{
  "status": "error",
  "message": "Description of what went wrong"
}
```

### Common Validation Errors
- `400 Bad Request` - Invalid input data (e.g., password < 8 chars, email format invalid)
  - Response includes field-specific error messages from Zod validation
  - Example: `"firstName must be at least 2 characters long"`

- `400 Bad Request` - Duplicate username or email
  - Message: `"User already exist try different email or username"`

- `401 Unauthorized` - Token missing or invalid
  - Message: `"user no longer exists"` (token valid but user deleted)
  - Missing auth header returns null user for optional auth routes

- `401 Unauthorized` - Invalid credentials on login
  - Username doesn't exist: `"Invalid credentials"`
  - Password mismatch: `"Invalid password"`

- `403 Forbidden` - Permission denied
  - Not post owner trying to update/delete: `"You are not authorized to perform this action"`
  - Not comment owner trying to delete: `"You are not authorized"`

- `404 Not Found` - Resource doesn't exist
  - Post not found: `"Post not found"`
  - User not found: `"User not found"`
  - Comment not found: `"Comment not found"`

- `429 Too Many Requests` - Rate limit exceeded
  - Global limit: 100 requests per 15 minutes
  - Auth limit: 10 requests per hour
  - Response includes RateLimit headers

- `500 Internal Server Error` - Server-side error
  - Logging via Winston logger
  - Message: `"Something went wrong"`

---

## Rate Limiting Details

### Rate Limit Headers
Express-rate-limit uses RateLimit-* draft-8 standard headers:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Unix timestamp when limit resets

### Bypass Scenarios
- **Global Limit (100/15min):** Applied to all routes except `/api`
- **Auth Limit (10/hour):** Applied only to register and login endpoints
- **IPv6 Handling:** 56-bit subnet aggregation (can adjust in rateLimiter.js)

---

## Quick Test Examples

### 1. Register (Note: password must be at least 8 characters)
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"John",
    "lastName":"Doe",
    "username":"johndoe",
    "email":"john@example.com",
    "password":"password123"
  }'
```

### 2. Login (Get token - copy it from response)
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username":"johndoe",
    "password":"password123"
  }'
```

### 3. Create Post (Replace TOKEN with your actual token from login)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title":"My First Blog Post",
    "content":"This is my blog content with more than 12 characters"
  }'
```

### 4. View Your Profile
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TOKEN"
```

### 5. Get All Posts
```bash
curl -X GET http://localhost:3000/api/posts \
  -H "Authorization: Bearer TOKEN"
```

### 6. Add Comment to a Post
```bash
curl -X POST http://localhost:3000/api/posts/POST_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "text": "Great article!"
  }'
```

### 7. Like a Post
```bash
curl -X POST http://localhost:3000/api/posts/POST_ID/like \
  -H "Authorization: Bearer TOKEN"
```

### 8. Search Users
```bash
curl -X GET "http://localhost:3000/api/users?search=john&page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

---

---

## Environment Variables Required

Create a `.env` file in the project root with:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/blogging_db

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=192.168.1.103
```

**Important:**
- Change `JWT_SECRET` in production to a strong random string
- Use environment-specific database URLs
- `JWT_EXPIRES_IN` supports formats: "7d", "24h", "1800s"

---

## Setup & Running

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Bun or npm

### Installation
```bash
cd backend
npm install
```

### Database Setup
```bash
# Create database and run migrations
npm run build

# (Optional) Seed with fake data
npm run seed
```

### Run Development Server
```bash
npm run dev
```
Server will be available at `http://localhost:3000/api`

### Production Build
```bash
npm start
```

---

## Complete API Workflow Example

### Step 1: Register New User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Jane",
    "lastName":"Smith",
    "username":"janesmith",
    "email":"jane@example.com",
    "password":"SecurePass123"
  }'
# Response includes: token, user object, and sets jwt cookie
```

### Step 2: Save Token
Copy the `token` value from the response. Use it for authenticated requests.

### Step 3: Create a Blog Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title":"My First Blog",
    "content":"This is my first blog post with substantial content"
  }'
# Returns: post object with id, user_id, created_at
```

### Step 4: Get Your Posts
```bash
curl -X GET http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 5: Get Single Post Details
```bash
curl -X GET http://localhost:3000/api/posts/POST_ID_HERE
# No auth needed - posts are public
```

### Step 6: Add Comment
```bash
curl -X POST http://localhost:3000/api/posts/POST_ID_HERE/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "text": "Excellent post!"
  }'
```

### Step 7: Like the Post
```bash
curl -X POST http://localhost:3000/api/posts/POST_ID_HERE/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 8: View Your Stats
```bash
curl -X GET http://localhost:3000/api/users/me/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
# Returns: totalPosts, totalComments, totalLikes
```

### Step 9: Update Your Post
```bash
curl -X PATCH http://localhost:3000/api/posts/POST_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title":"Updated Title",
    "content":"Updated content with new information"
  }'
# Only if you own the post
```

### Step 10: Logout
```bash
curl -X GET http://localhost:3000/api/users/logout
# Clears jwt cookie and ends session
```

---

## Key Implementation Details

### Data Validation (Zod)
- All inputs are validated before processing
- Type-safe with TypeScript-like error messages
- Field-specific error feedback

### Password Security
- Hashed with bcryptjs (salt rounds: 10)
- Never returned in responses
- Compared securely using bcrypt.compare()

### Database Integrity
- Foreign key cascading (deleting user deletes all posts/comments/likes)
- Unique constraints on username, email, and (post_id, user_id) for likes
- UUID primary keys

### Security Headers (Helmet)
- X-Frame-Options (clickjacking protection)
- X-XSS-Protection (XSS filter)
- X-Content-Type-Options (MIME sniffing protection)
- Content-Security-Policy (CSP)

### CORS Configuration
- Restricted to specific origin (192.168.1.103)
- Allows: GET, POST, PUT, PATCH, DELETE
- Allowed headers: Content-Type, Authorization

### Input Sanitization
- HTML tags stripped from post content (sanitize-html library)
- Prevents XSS attacks and injection vulnerabilities

### Logging
- Morgan: HTTP request logging (combined/dev format)
- Winston: Application-level logging for errors and info
- Logs stored for audit trail

### Session Management
- HTTP-only cookies prevent JavaScript access
- CSRF protection via SameSite=strict
- Auto-expire after 7 days (configurable)

---

## API Summary

| Feature | Details |
|---------|---------|
| **Framework** | Express.js v5.2.1 |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | JWT tokens + Secure cookies |
| **Validation** | Zod schemas |
| **Security** | Helmet, bcrypt, sanitize-html, rate limiting |
| **Logging** | Morgan + Winston |
| **Deployment** | NOdejs runtime (can use Bun.js) |
| **Rate Limits** | 100/15min global, 10/hour auth |
| **Response Format** | JSON with status field |

---

## Troubleshooting

### "JWT_SECRET is not defined"
- Check .env file exists
- Ensure JWT_SECRET variable is set
- Restart server after adding to .env

### "Invalid credentials" during login
- Verify username exists (case-sensitive)
- Check password is correct
- Confirm user registered successfully

### "You are not authorized" when updating post
- Ensure you're the post owner (user_id must match)
- Check token is valid and not expired
- Verify header format: `Authorization: Bearer TOKEN`

### Rate limit errors (429)
- Wait for window to reset
- Global: 15 minutes
- Auth: 1 hour
- Use different IP/proxy to test further requests

### CORS errors
- Check request origin matches CORS_ORIGIN in .env
- Verify Content-Type header is application/json
- Check if Authorization header is included correctly
