require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Batch = require('../models/Batch');

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Batch.deleteMany({});

  const admin = await User.create({ name: 'Admin', email: 'admin@edubatch.com', password: 'Admin@123', role: 'admin' });
  const teacher = await User.create({ name: 'Teacher One', email: 'teacher@edubatch.com', password: 'Teach@123', role: 'teacher' });
  const student = await User.create({ name: 'Student One', email: 'student@edubatch.com', password: 'Stud@123', role: 'student' });

  await Batch.create({
    name: 'JEE 2027 Morning',
    subject: 'Physics',
    description: 'JEE Physics batch',
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    schedule: { days: ['Mon', 'Wed', 'Fri'], startTime: '07:00', endTime: '09:00' },
    capacity: 30,
    fee: 5000,
    teacher: teacher._id,
    status: 'active',
    createdBy: admin._id,
  });

  console.log('✅ Seed completed');
  console.log('Admin: admin@edubatch.com / Admin@123');
  console.log('Teacher: teacher@edubatch.com / Teach@123');
  console.log('Student: student@edubatch.com / Stud@123');
  await mongoose.connection.close();
};

seed();