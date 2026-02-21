# Todo List Application

Một ứng dụng Todo List hoàn chỉnh với 3 level chức năng từ API backend đến giao diện web với hệ thống phân quyền.

## Features

### Level 1: Backend APIs
-  User authentication với password hashing (bcryptjs)
- MongoDB collections cho User và Task
-  APIs: getAllTasks, getTasksByUser, getTodayTasks, getIncompleteTasks, getTasksByLastname

### Level 2: Web Interface
- EJS templates cho register, login, dashboard
- Task input với nút add
- Dynamic task list với delete buttons
- Bootstrap progress bar
- Filter tabs (All, Pending, Completed)
- Responsive design

### Level 3: Role & Permission System
- Admin và Normal roles
- Assign tasks to multiple users
- Task completion when all assigned users complete
- Permission-based actions

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Frontend**: EJS + Bootstrap 5 + Vanilla JavaScript
- **Authentication**: JWT
- **Password Encryption**: bcryptjs

## Project Structure

```
├── config/               # Database configuration
├── models/              # Mongoose schemas (User, Task)
├── routes/              # API routes
├── middleware/          # Authentication middleware
├── views/               # EJS templates
├── public/              # Static files
├── server.js            # Main app entry
└── DOCUMENTATION.md     # Detailed documentation
```

## Quick Start

### Prerequisites
- Node.js 14+
- MongoDB running locally

### Installation

```bash
npm install
```

### Configuration

Create or update `.env`:
```
MONGODB_URI=mongodb://localhost:27017/todo_app
PORT=3000
JWT_SECRET=your_secret_key_here
```

### Running

```bash
# Production
npm start

# Development with auto-reload
npm run dev
```

Visit `http://localhost:3000`

## API Endpoints

### User Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/all` - Get all users
- `GET /api/users/:id` - Get user by ID

### Task Routes
- `GET /api/tasks/all` - Get all tasks
- `GET /api/tasks/user/:username` - Get tasks by username
- `GET /api/tasks/today/all` - Get today's tasks
- `GET /api/tasks/incomplete/all` - Get incomplete tasks
- `GET /api/tasks/author/nguyen` - Get tasks from users with last name "Nguyễn"
- `POST /api/tasks/create` - Create new task (Auth required)
- `PUT /api/tasks/:taskId/complete` - Mark task as completed (Auth required)
- `PUT /api/tasks/:taskId/assign` - Assign task to user (Auth required)
- `DELETE /api/tasks/:taskId` - Delete task (Auth required)

## Authentication

- Password hashed with bcryptjs (10 salt rounds)
- JWT tokens issued on login
- Include token in Authorization header: `Bearer {token}`

## User Roles

### Admin
- Can create tasks
- Can assign tasks to any user
- Can delete any task
- Can view all tasks

### Normal User
- Can create tasks
- Can be assigned tasks by admin
- Can only delete own tasks
- Can complete assigned tasks

## Database Schema

### User Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String ('admin' or 'normal'),
  createdAt: Date
}
```

### Task Collection
```javascript
{
  title: String,
  description: String,
  createdBy: ObjectId (User),
  assignedTo: [ObjectId] (Users),
  status: String ('pending', 'in-progress', 'completed'),
  isCompleted: Boolean,
  completedAt: Date,
  completedBy: [{userId: ObjectId, completedAt: Date}],
  priority: String ('low', 'medium', 'high'),
  createdAt: Date
}
```

## UI Features

- Modern gradient design
- Bootstrap 5 styling
- Responsive layout
- Real-time progress bar
- Modal forms for assignments
- Status badges
- Priority indicators
- User info display

## Test Scenarios

1. **Registration & Login**: Create account and sign in
2. **Task Management**: Add, delete, filter tasks
3. **Assignment**: Assign tasks to multiple users, complete collaboratively
4. **Progress Tracking**: Monitor completion percentage

## Development

The application is fully functional with all 3 levels implemented. Refer to `DOCUMENTATION.md` for detailed information about each level.

## License

ISC

## Author

Developer

---

**Status**: All 3 Levels Implemented 
