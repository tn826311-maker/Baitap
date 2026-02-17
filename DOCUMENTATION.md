# 📋 Todo List Application - Documentation

## Tổng Quan Dự Án

Đây là một ứng dụng Todo List có ba level chức năng khác nhau:
- **Level 1**: API Backend với xác thực mật khẩu
- **Level 2**: Giao diện Web với EJS
- **Level 3**: Hệ thống phân quyền và phân công công việc

---

## Kiến Trúc Hệ Thống

### Công Nghệ Sử Dụng
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Frontend**: EJS Templates + Bootstrap 5 + Vanilla JavaScript
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcryptjs

### Cấu Trúc Thư Mục
```
baitap-1/
├── config/
│   └── database.js              # MongoDB connection config
├── models/
│   ├── User.js                  # User schema with password hashing
│   └── Task.js                  # Task schema with status tracking
├── routes/
│   ├── users.js                 # User authentication routes
│   └── tasks.js                 # Task CRUD & management routes
├── middleware/
│   └── auth.js                  # JWT authentication middleware
├── views/
│   ├── index.ejs                # Landing page
│   ├── register.ejs             # Registration form
│   ├── login.ejs                # Login form
│   └── dashboard.ejs            # Main task dashboard
├── public/
│   └── [static files]
├── server.js                    # Main application entry
├── package.json
├── .env                         # Environment variables
└── .gitignore
```

---

## LEVEL 1: API Backend

### Database Collections

#### User Collection
```javascript
{
  "_id": ObjectId,
  "username": String (unique),           // Tên đăng nhập duy nhất
  "email": String (unique),              // Email duy nhất
  "password": String (hashed with bcryptjs),  // Mật khẩu đã mã hóa
  "firstName": String,                   // Tên người dùng
  "lastName": String,                    // Họ người dùng
  "role": String (enum: ['admin', 'normal']), // Vai trò
  "createdAt": Date
}
```

#### Task Collection
```javascript
{
  "_id": ObjectId,
  "title": String,                       // Tiêu đề công việc
  "description": String,                 // Mô tả công việc
  "createdBy": ObjectId (ref: User),    // Người tạo (1 user - 1 creator)
  "assignedTo": [ObjectId] (ref: User), // Danh sách người được phân công
  "status": String (enum: ['pending', 'in-progress', 'completed']),
  "isCompleted": Boolean,                // Trái thái hoàn thành
  "completedAt": Date,                   // Thời gian hoàn thành
  "completedBy": [
    {
      "userId": ObjectId (ref: User),   // User đã hoàn thành
      "completedAt": Date                // Thời gian hoàn thành
    }
  ],
  "priority": String (enum: ['low', 'medium', 'high']), // Mức độ ưu tiên
  "dueDate": Date,                       // Hạn chót
  "createdAt": Date,
  "updatedAt": Date
}
```

### Level 1 APIs

#### 1. **User Authentication**

**POST** `/api/users/register`
```javascript
Request:
{
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "username": "nguyenvana",
  "email": "nguyenvana@example.com",
  "password": "password123"
}

Response (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77...",
    "username": "nguyenvana",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "role": "normal"
  }
}
```

**POST** `/api/users/login`
```javascript
Request:
{
  "username": "nguyenvana",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### 2. **Task Management APIs**

**POST** `/api/tasks/create` (Authentication Required)
```javascript
Request Header:
Authorization: Bearer eyJhbGc...

Request Body:
{
  "title": "Hoàn thành báo cáo",
  "description": "Báo cáo tháng 2",
  "priority": "high"
}

Response (201):
{
  "message": "Task created successfully",
  "task": { ... }
}
```

**GET** `/api/tasks/all`
```
Lấy tất cả các task đang có
Response: { count: 5, tasks: [...] }
```

**GET** `/api/tasks/user/:username`
```
Lấy task theo tên user
Response: { count: 3, tasks: [...] }
```

**GET** `/api/tasks/today/all`
```
Lấy các task tạo trong ngày hiện tại
Response: { count: 2, tasks: [...] }
```

**GET** `/api/tasks/incomplete/all`
```
Lấy các task chưa hoàn thành
Response: { count: 4, tasks: [...] }
```

**GET** `/api/tasks/author/nguyen`
```
Lấy các task của user có họ là "Nguyễn"
Response: { 
  count: 3, 
  users: [{id: "...", name: "Nguyễn Văn A"}],
  tasks: [...]
}
```

### Password Security
- ✅ Mật khẩu được hash bằng **bcryptjs** với salt rounds = 10
- ✅ Không lưu mật khẩu gốc trong database
- ✅ So sánh mật khẩu an toàn với `bcrypt.compare()`

### Authentication Flow
1. User đăng ký/đăng nhập
2. Server hash mật khẩu và lưu vào database
3. Server tạo JWT token
4. Client lưu token vào localStorage
5. Mỗi request đến API authenticate được gửi header: `Authorization: Bearer {token}`
6. Middleware kiểm tra token và cho phép truy cập

---

## LEVEL 2: Web Interface

### Các Trang Web

#### 1. **Trang Chính** (`/`)
- Các nút Đăng Nhập và Tạo Tài Khoản
- Giao diện sạch, dễ sử dụng

#### 2. **Trang Đăng Ký** (`/register`)
- Form nhập: Tên, Họ, Username, Email, Mật khẩu
- Validation phía client
- Xác nhận mật khẩu khớp

#### 3. **Trang Đăng Nhập** (`/login`)
- Form nhập: Username, Mật khẩu
- Lưu token vào localStorage

#### 4. **Trang Dashboard** (`/dashboard`) - **Chính**

**Features:**
- ✅ **Danh sách công việc động** với UI đẹp
- ✅ **Nút thêm công việc** + input
- ✅ **Nút xóa** cho mỗi công việc
- ✅ **Status badge** (Chưa Làm, Đang Làm, Hoàn Thành)
- ✅ **Priority level** (Thấp, Trung Bình, Cao)
- ✅ **Statistics box** (Tổng, Hoàn Thành, Chưa Hoàn Thành)
- ✅ **Progress bar** (Bootstrap progress bar) hiển thị %
- ✅ **Filter tabs** (Tất Cả, Chưa Làm, Hoàn Thành)
- ✅ **Responsive design** - tương thích mobile

**Công Việc Quy Trình:**
1. User nhập text trong input
2. Chọn priority từ dropdown
3. Click nút "Thêm"
4. Công việc được gửi API POST `/api/tasks/create`
5. UI cập nhật realtime
6. Danh sách hiển thị với nút Hoàn Thành, Xóa

---

## LEVEL 3: Role & Permission System

### Hai Vai Trò Chính

#### 1. **Admin Role**
- ✅ Có thể tạo công việc
- ✅ Có thể phân công công việc cho bất kỳ user nào
- ✅ Có thể xóa bất kỳ công việc nào
- ✅ Có thể xem tất cả công việc

#### 2. **Normal Role**
- ✅ Có thể tạo công việc
- ✅ Có thể được phân công công việc bởi Admin
- ✅ Chỉ có thể xóa công việc của mình
- ✅ Có thể hoàn thành công việc được phân công

### Phân Công Multiple Users

**Scenarios:**
- 1 task có thể được phân công cho nhiều user cùng một lúc
- Mỗi user phải hoàn thành riêng lẻ
- Task chỉ được mark hoàn thành khi **TẤT CẢ** user phân công đều click hoàn thành

**Ví dụ Workflow:**
```
Task: "Làm slide trình bày"
└─ Phân công cho:
   ├─ User A (Nguyễn Văn A)
   └─ User B (Trần Văn B)

Quá trình:
1. User A click "Hoàn Thành" → Task vẫn pending
2. User B click "Hoàn Thành" → Task = Completed ✅
3. Progress bar hiển thị: 2/2 completed
```

### Level 3 APIs

**PUT** `/api/tasks/:taskId/assign`
```javascript
Request:
{
  "userId": "607f1f77..."
}

Response:
{
  "message": "Task assigned successfully",
  "task": {
    "assignedTo": ["607f1f77...", "607f1f78..."],
    ...
  }
}
```

**PUT** `/api/tasks/:taskId/complete`
```javascript
Endpoint khác cho mỗi user complete riêng
Middleware kiểm tra user có được phân công không
Nếu tất cả user hoàn thành → isCompleted = true
```

### UI Update cho Level 3

**Dashboard được cập nhật:**
- 👥 **Danh sách người được phân công** - hiển thị dưới mỗi task
- ✅ **Danh sách người đã hoàn thành** - hiển thị dưới task
- 👤 **Nút "Phân Công"** - mở modal chọn user (chỉ creator/admin)
- 🔄 **Modal Form** - chọn user từ dropdown, xác nhận phân công

---

## Installation & Running

### Prerequisites
- Node.js 14+
- MongoDB running locally or connection string

### Setup

```bash
# 1. Clone hoặc điều hướng vào project
cd d:\Baitap-1

# 2. Install dependencies
npm install

# 3. Cấu hình .env
# MONGODB_URI=mongodb://localhost:27017/todo_app
# PORT=3000
# JWT_SECRET=your_secret_key_here

# 4. Start server
npm start

# 5. Truy cập http://localhost:3000
```

### Development Mode
```bash
npm install -g nodemon
npm run dev
```

---

## Test Scenarios

### Test Case 1: User Registration & Login
1. Truy cập `/register`
2. Nhập thông tin: Nguyễn Văn A, nguyenvana@mail.com, pass123
3. Click Tạo Tài Khoản → Redirect `/dashboard`
4. Logout → Đăng nhập lại

### Test Case 2: Task Management
1. Create 3 tasks với priority khác nhau
2. Filter bằng các tabs
3. Xóa 1 task
4. Progress bar cập nhật

### Test Case 3: Level 3 - Assign Task
1. Login as Admin
2. Create task
3. Click "Phân Công" → Select user
4. Confirm assignment
5. User khác login → Nhìn thấy task được phân công
6. Cả 2 click "Hoàn Thành" → Task = Completed

---

## Features Implemented

### ✅ Level 1
- [x] MongoDB với 2 collections: User + Task
- [x] Password hashing với bcryptjs
- [x] getAllTasks API
- [x] getTasksByUsername API
- [x] getTodayTasks API
- [x] getIncompleteTasks API
- [x] getTasksByLastname API

### ✅ Level 2
- [x] EJS templates (register, login, dashboard, index)
- [x] Task input + Add button
- [x] Task list display (ul)
- [x] Delete button cho mỗi task
- [x] Bootstrap progress bar
- [x] Responsive design
- [x] Dynamic UI update

### ✅ Level 3
- [x] Role system (admin + normal)
- [x] Assign task to multiple users
- [x] Multiple users completing same task
- [x] Task completion only when all assigned users complete
- [x] Modal form for assigning
- [x] Show assigned users in UI
- [x] Show completed users list

---

## Error Handling

- JWT token validate trên mỗi protected route
- Username/email unique constraint
- Validate input trước lưu database
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Error messages rõ ràng cho user

---

## Security Features

1. ✅ Password hashing với bcryptjs (10 salt rounds)
2. ✅ JWT token authentication
3. ✅ Role-based access control (RBAC)
4. ✅ Permission checking trước mỗi sensitive action
5. ✅ Unique username constraint

---

## Deployment Notes

- Cần MongoDB server running
- Update .env với đúng MONGODB_URI
- Update JWT_SECRET với key mạnh
- Set NODE_ENV=production cho production

---

**Hoàn tất: 17/02/2026**
**Status: All 3 Levels Implemented ✅**
