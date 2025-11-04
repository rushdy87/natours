import mongoose from 'mongoose';

const URL = process.env.DATABASE_LOCAL.replace(
  '<USERNAME>',
  process.env.DATABASE_USERNAME,
).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log('✅ MongoDB connected successfully'.bgWhite.blue);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};

export default connectDB;
