# BlogHub - Complete Project Documentation

A full-stack blog application built with Vue 3, Express.js, Prisma, and Tailwind CSS.

## 🌟 Project Overview

BlogHub is a modern blogging platform where users can:
- Create and publish blog posts
- Read and interact with posts
- Leave comments on posts
- Like/unlike posts
- View user profiles with statistics
- Search for posts by title or content

---

## 📂 Project Structure

```
bloging website/
├── backend/                          # Express.js Backend
│   ├── src/
│   │   ├── controllers/             # Business logic
│   │   │   ├── userController.js
│   │   │   ├── postController.js
│   │   │   ├── commentController.js
│   │   │   ├── likeController.js
│   │   │   └── statController.js
│   │   ├── routes/                  # API endpoints
│   │   ├── middleware/              # Custom middleware
│   │   ├── validators/              # Input validation (Zod)
│   │   ├── utils/                   # Helper functions
│   │   ├── config/                  # Configuration files
│   │   └── app.js                   # Express app setup
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   ├── migrations/              # Database migrations
│   │   └── seed.js                  # Seed data
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── README.md
│
├── frontend/                         # Vue 3 Frontend
│   ├── src/
│   │   ├── api/                     # API service layer
│   │   ├── assets/                  # Static assets
│   │   ├── components/              # Reusable Vue components
│   │   │   ├── Navbar.vue
│   │   │   ├── PostCard.vue
│   │   │   ├── CommentItem.vue
│   │   │   └── Footer.vue
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── CreatePost.vue
│   │   │   ├── PostDetail.vue
│   │   │   └── Profile.vue
│   │   ├── store/                   # Pinia stores
│   │   │   ├── index.js             # Auth store
│   │   │   └── posts.js             # Posts store
│   │   ├── utils/                   # Helper functions
│   │   ├── router.js                # Route configuration
│   │   ├── App.vue                  # Root component
│   │   └── main.js                  # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── API.md                           # API endpoints documentation
├── SETUP_GUIDE.md                   # Setup and deployment guide
└── README.md                        # Main readme
```

---

## 🗄️ Database Schema

### User Table
```
- id (UUID, Primary Key)
- firstName (String)
- lastName (String)
- username (String, Unique)
- email (String, Unique)
- password (String, Hashed)
- created_at (DateTime)

Relations:
- posts: Post[] (One-to-Many)
- comments: Comment[] (One-to-Many)
- likes: Like[] (One-to-Many)
```

### Post Table
```
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- title (String)
- content (String)
- created_at (DateTime)

Relations:
- user: User (Many-to-One)
- comments: Comment[] (One-to-Many)
- likes: Like[] (One-to-Many)
```

### Comment Table
```
- id (UUID, Primary Key)
- post_id (UUID, Foreign Key)
- user_id (UUID, Foreign Key)
- text (String)
- created_at (DateTime)

Relations:
- post: Post (Many-to-One)
- user: User (Many-to-One)
```

### Like Table
```
- id (UUID, Primary Key)
- post_id (UUID, Foreign Key)
- user_id (UUID, Foreign Key)
- created_at (DateTime)

Relations:
- post: Post (Many-to-One)
- user: User (Many-to-One)
Constraint: Unique(post_id, user_id)
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│  Register   │
│   Screen    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│ POST /api/users/register        │
│ Body: { firstName, lastName,    │
│ username, email, password }     │
└─────────────┬───────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Hash password with  │
    │ bcryptjs (10 rounds)│
    │ Check if user exists│
    └────────┬────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Create user in database         │
    │ Generate JWT token (exp: 7 days)│
    │ Store token in localStorage     │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────┐
    │    Home     │ ◄─────────────────┐
    │   Screen    │                   │
    └─────────────┘                   |
            ┌──────────────────────────┐
            │ Add JWT to Authorization │
            │ Header: "Bearer {token}" |
            |                          │
            └──────────────────────────┘
```

---

## 📡 API Response Patterns

### Success Response
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "username": "string",
    ...
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "totalUsers": 100,
    "totalPages": 10,
    "currentPage": 1,
    "limit": 10
  }
}
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios API

### DevTools
- **Package Manager**: npm/bun
- **Version Control**: Git
- **Database**: PostgreSQL

---

## 🔑 Key Features Explained

### 1. Authentication System
- User registration with validation
- Secure password hashing (bcryptjs)
- JWT token-based authentication
- Automatic token refresh on app load
- Secure logout with token removal

### 2. Post Management
- Create, read, update, delete (CRUD) operations
- Rich text support
- Pagination support
- Search functionality (title & content)
- User-specific filtering

### 3. Comments System
- Add comments to posts
- Comment owner can delete their own comments
- Post owner can delete any comments on their posts
- Pagination for comments
- Chronological display

### 4. Like System
- Toggle like/unlike on posts
- Prevent duplicate likes (unique constraint)
- Like count tracking
- User like history

### 5. Statistics
- User stats (posts, likes, comments in last 30 days)
- Admin stats (total users, posts, comments, likes)
- Real-time statistics

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] All environment variables set correctly
- [ ] Database migrations run successfully
- [ ] Backend tests pass
- [ ] Frontend builds without errors
- [ ] Security vulnerabilities checked
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Error logging enabled

### Deployment Steps

#### Backend
1. Build application
2. Set production environment variables
3. Run database migrations
4. Start with process manager (PM2)
5. Set up reverse proxy (Nginx)
6. Enable HTTPS/SSL

#### Frontend
1. Run `npm run build`
2. Deploy dist/ folder to CDN/hosting
3. Configure environment for production
4. Set up redirect rules for SPA

---

## 🔒 Security Features

1. **Password Security**
   - bcryptjs hashing (10 rounds)
   - Minimum 8 characters

2. **Authentication**
   - JWT tokens with 7-day expiry
   - httpOnly cookies set up
   - Token sent in Authorization header

3. **Input Validation**
   - Zod schema validation
   - Email format validation
   - String length validation

4. **Database Security**
   - Prepared statements via Prisma
   - User input sanitization
   - Principle of least privilege

5. **API Security**
   - CORS configuration
   - Request rate limiting
   - Error message sanitization

---

## 📈 Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Lazy loading routes
- Component memoization
- Tailwind CSS tree-shaking
- Image optimization

### Backend
- Database query optimization
- Pagination for large datasets
- Caching strategies
- Connection pooling
- Index optimization

---

## 🧪 Testing Scenarios

### Authentication
- ✅ Register new user
- ✅ Login with correct credentials
- ✅ Login with wrong credentials
- ✅ Logout successfully
- ✅ Auto-login on page refresh

### Posts
- ✅ Create post
- ✅ Edit own post
- ✅ Delete own post
- ✅ View post details
- ✅ Search posts

### Comments
- ✅ Add comment
- ✅ Delete own comment
- ✅ Delete as post owner
- ✅ Cannot delete others' comments

### Likes
- ✅ Like post
- ✅ Unlike post
- ✅ Toggle like functionality

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Cannot connect to DB | Check DATABASE_URL in .env or if you set in shell env, verify PostgreSQL is running |
| Frontend can't reach backend | Check API_BASE_URL, ensure backend runs on port 3000 |
| JWT token invalid | Verify JWT_SECRET matches between backend and auth |
| CORS errors | Check CORS configuration in Express app |
| Post not updating | Clear browser cache, check network tab for errors |
| Comments not showing | Verify pagination, check for API errors |

---

## 📚 Learning Resources

- [Vue 3 Official Docs](https://vuejs.org/)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT Explanation](https://jwt.io/introduction)
- [RESTful API Design](https://restfulapi.net/)

---

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile customization
- [ ] Follow/Unfollow system
- [ ] Category/Tags for posts
- [ ] Rich text editor
- [ ] Image upload
- [ ] Dark mode
- [ ] Notifications system
- [ ] Two-factor authentication

---

## 👥 Contributing Guidelines

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

---

## 📄 License

This project is open source under the MIT License.

---

## 📞 Support

For issues, questions, or suggestions, please:
1. Check existing documentation
2. Review API documentation
3. Check browser console for errors
4. Review network tab in DevTools

---

**Last Updated**: December 2025  
**Maintained By**: Development Team  
**Version**: 1.0.0

---

Made with ❤️ and ☕
