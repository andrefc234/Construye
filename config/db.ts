// utils/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  }
};

export default connectDB;
