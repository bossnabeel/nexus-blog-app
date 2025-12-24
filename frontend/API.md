GET /api/admin/stats

GET    /api/users/me
GET    /api/users/me/stats
GET    /api/users/logout
POST   /api/users/login
POST   /api/users/register

GET    /api/posts
POST   /api/posts
GET    /api/posts/:postId
POST   /api/posts/:postId/comments
DELETE /api/posts/:postId/comments/:commentId
GET    /api/posts/:postId/likes
POST   /api/posts/:postId/likes

QUERY  /api/posts?search=value+value
       /api/users/?search=value+value

LIMIT 
      /api/posts?search=value+value&limit=value&page=value
     /api/users?search=value+valuelimit=value&page=value