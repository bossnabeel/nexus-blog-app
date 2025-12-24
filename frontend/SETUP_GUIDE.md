# Full Stack Blog Setup Guide

Complete guide to run the entire BlogHub application (Backend + Frontend).

## 📋 System Requirements

- **Node.js**: v16 or higher
- **npm/yarn**: Latest version
- **PostgreSQL**: Database server running
- **Git**: For version control (optional)

## 🔧 Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the backend root:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/blog"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
```

**Replace:**
- `USER`: Your PostgreSQL username
- `PASSWORD`: Your PostgreSQL password
- `blog`: Your database name

### 4. Database Setup

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database (optional)
node prisma/seed.js
```

### 5. Start Backend Server

```bash
npm run dev
# or
npm start
```

**Expected output:**
```
http://localhost:3000/api
```

## 🎨 Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Install additional dependencies (if not already in package.json)
```bash
npm install vue-router@latest
```

### 4. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### 5. Open in Browser

Navigate to `http://localhost:5173/` in your web browser.

---

## ✅ Testing the Application

### 1. Register a New User
- Go to http://localhost:5173/register
- Fill in the registration form
- Submit and you'll be redirected to home

### 2. Create a Post
- Click "+ New Post" in the navbar
- Write a title and content
- Click "Publish Post"

### 3. View Posts
- Posts appear on the home page
- Click "Read More" to view full post
- Add comments and likes

### 4. View Profile
- Click your avatar/name in navbar
- View your stats and recent posts

---

## 🐛 Troubleshooting

### Backend Issues

#### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

#### Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl start postgresql

# Verify connection string in .env
# Format: postgresql://user:password@host:port/database
```

#### Prisma migration issues
```bash
# Reset database
npx prisma migrate reset

# Generate client again
npx prisma generate
```

### Frontend Issues

#### Blank page or 404 errors
- Ensure backend is running on port 3000
- Check browser console for errors (F12)
- Clear browser cache (Ctrl+Shift+Delete)

#### Cannot login/register
- Verify backend URL in `src/api/api.js`
- Should be: `http://localhost:3000/api`
- Check backend is running

#### Styling not working
```bash
# Rebuild Tailwind CSS
npm run build

# Clear cache
rm -rf node_modules/.vite
```

---

## 📊 API Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected endpoints require:
```
Authorization: Bearer <token>
```

### Main Endpoints

**Users:**
- `POST /users/register` - Register
- `POST /users/login` - Login
- `GET /users/me` - Current user
- `GET /users/me/stats` - User statistics
- `GET /users/logout` - Logout

**Posts:**
- `GET /posts` - All posts
- `POST /posts` - Create post
- `GET /posts/:postId` - Single post
- `PUT /posts/:postId` - Update post
- `DELETE /posts/:postId` - Delete post

**Comments:**
- `POST /posts/:postId/comments` - Add comment
- `DELETE /posts/:postId/comments/:commentId` - Delete comment

**Likes:**
- `POST /posts/:postId/likes` - Toggle like
- `GET /posts/:postId/likes` - Get likes

---

## 🚀 Production Deployment

### Backend (Node.js)

#### Using PM2
```bash
npm install -g pm2

# Start with PM2
pm2 start npm --name "blog-backend" -- start

# Monitor
pm2 monit
```

#### Using Docker
```bash
docker build -t blog-backend .
docker run -p 3000:3000 --env-file .env blog-backend
```

### Frontend (Vue.js)

#### Build for Production
```bash
npm run build
# Creates dist/ folder
```

#### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

#### Deploy to Netlify
```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

#### Using Docker
```bash
docker build -t blog-frontend .
docker run -p 80:80 blog-frontend
```

---

## 📝 Environment Variables Checklist

### Backend (.env)
- [ ] DATABASE_URL set correctly
- [ ] JWT_SECRET defined (use strong secret)
- [ ] JWT_EXPIRES_IN set (e.g., "7d")
- [ ] NODE_ENV set to "development" or "production"
- [ ] PORT defined (default: 3000)

### Frontend (src/api/api.js)
- [ ] API_BASE_URL points to backend
- [ ] Default: `http://localhost:3000/api`

---

## 📚 Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com/)

---

## 🎓 Learning Path

1. Understand REST API concepts
2. Learn Prisma ORM basics
3. Understand Vue 3 Composition API
4. Learn Pinia state management
5. Master Tailwind CSS utilities
6. Practice building features

---

## 💡 Tips & Best Practices

1. **Always validate input** on both frontend and backend
2. **Use environment variables** for sensitive data
3. **Keep components small** and focused
4. **Use Pinia stores** for shared state
5. **Add error handling** for all API calls
6. **Test thoroughly** before deployment
7. **Monitor logs** for debugging issues

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📞 Support & Help

- Check console logs for errors
- Review API responses in Network tab
- Consult documentation links above
- Ask in developer communities

---

**Good luck with your BlogHub! Happy coding! 🚀**
