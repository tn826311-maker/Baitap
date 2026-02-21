const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Task = require('./models/Task');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        username: 'admin_user',
        email: 'admin@example.com',
        password: 'admin123456',
        firstName: 'Admin',
        lastName: 'System',
        role: 'admin',
      },
      {
        username: 'tuan_nguyen',
        email: 'tuan@example.com',
        password: 'tuan123456',
        firstName: 'Tuấn',
        lastName: 'Nguyễn',
        role: 'normal',
      },
      {
        username: 'minh_tran',
        email: 'minh@example.com',
        password: 'minh123456',
        firstName: 'Minh',
        lastName: 'Trần',
        role: 'normal',
      },
      {
        username: 'linh_nguyen',
        email: 'linh@example.com',
        password: 'linh123456',
        firstName: 'Linh',
        lastName: 'Nguyễn',
        role: 'normal',
      },
      {
        username: 'hoang_pham',
        email: 'hoang@example.com',
        password: 'hoang123456',
        firstName: 'Hoàng',
        lastName: 'Phạm',
        role: 'normal',
      },
      {
        username: 'vinh_le',
        email: 'vinh@example.com',
        password: 'vinh123456',
        firstName: 'Vinh',
        lastName: 'Lê',
        role: 'normal',
      },
    ]);
    console.log(`✓ Created ${users.length} users`);

    // Create sample tasks
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tasks = await Task.create([
      {
        title: 'Hoàn thành báo cáo hàng tuần',
        description: 'Viết báo cáo tiến độ công work cho tuần này',
        createdBy: users[0]._id,
        assignedTo: [users[1]._id, users[2]._id],
        status: 'pending',
        isCompleted: false,
        priority: 'high',
        createdAt: today,
        dueDate: tomorrow,
      },
      {
        title: 'Review code của team',
        description: 'Kiểm tra pull requests từ các thành viên',
        createdBy: users[1]._id,
        assignedTo: [users[1]._id],
        status: 'in-progress',
        isCompleted: false,
        priority: 'medium',
        createdAt: today,
        dueDate: tomorrow,
      },
      {
        title: 'Cập nhật tài liệu API',
        description: 'Cập nhật documentation cho các endpoints mới',
        createdBy: users[3]._id,
        assignedTo: [users[3]._id, users[4]._id],
        status: 'pending',
        isCompleted: false,
        priority: 'medium',
        createdAt: today,
        dueDate: tomorrow,
      },
      {
        title: 'Deploy ứng dụng lên production',
        description: 'Deploy version 2.0 lên server production',
        createdBy: users[0]._id,
        assignedTo: [users[0]._id, users[1]._id],
        status: 'completed',
        isCompleted: true,
        priority: 'high',
        completedAt: today,
        completedBy: [
          { userId: users[0]._id, completedAt: today },
          { userId: users[1]._id, completedAt: today },
        ],
        createdAt: yesterday,
      },
      {
        title: 'Fix bug login process',
        description: 'Sửa lỗi đăng nhập trên mobile app',
        createdBy: users[2]._id,
        assignedTo: [users[2]._id],
        status: 'in-progress',
        isCompleted: false,
        priority: 'high',
        createdAt: today,
        dueDate: new Date(today.getTime() + 3600000), // 1 hour from now
      },
      {
        title: 'Thiết kế UI cho dashboard mới',
        description: 'Tạo mockup và design cho dashboard',
        createdBy: users[4]._id,
        assignedTo: [users[4]._id, users[5]._id],
        status: 'pending',
        isCompleted: false,
        priority: 'low',
        createdAt: today,
        dueDate: new Date(today.getTime() + 86400000 * 3), // 3 days
      },
      {
        title: 'Chuẩn bị presentation cho client',
        description: 'Prepare slide presentation cho demo product',
        createdBy: users[3]._id,
        assignedTo: [users[3]._id, users[0]._id],
        status: 'pending',
        isCompleted: false,
        priority: 'high',
        createdAt: today,
        dueDate: tomorrow,
      },
      {
        title: 'Kiểm tra security vulnerabilities',
        description: 'Scan code cho security issues',
        createdBy: users[0]._id,
        assignedTo: [users[0]._id],
        status: 'completed',
        isCompleted: true,
        priority: 'high',
        completedAt: today,
        completedBy: [{ userId: users[0]._id, completedAt: today }],
        createdAt: yesterday,
      },
      {
        title: 'Training cho team members',
        description: 'Đào tạo sử dụng công cụ mới cho team',
        createdBy: users[1]._id,
        assignedTo: [users[2]._id, users[3]._id, users[4]._id],
        status: 'pending',
        isCompleted: false,
        priority: 'medium',
        createdAt: today,
        dueDate: new Date(today.getTime() + 86400000 * 5), // 5 days
      },
      {
        title: 'Backup database',
        description: 'Thực hiện backup database toàn bộ hệ thống',
        createdBy: users[5]._id,
        assignedTo: [users[0]._id, users[5]._id],
        status: 'in-progress',
        isCompleted: false,
        priority: 'high',
        createdAt: today,
        dueDate: new Date(today.getTime() + 3600000 * 2), // 2 hours
      },
    ]);
    console.log(`✓ Created ${tasks.length} tasks`);

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📋 Sample Users Created:');
    users.forEach((user, index) => {
      console.log(
        `  ${index + 1}. ${user.firstName} ${user.lastName} (@${user.username}) - ${user.role}`
      );
    });

    console.log('\n📝 Sample Tasks Created:');
    tasks.forEach((task, index) => {
      console.log(`  ${index + 1}. ${task.title} (${task.status})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
