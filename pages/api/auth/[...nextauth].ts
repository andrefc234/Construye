// auth/[...nextauth].js

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import connectDB from '../../../config/db'; // Import the MongoDB connection function
import User from '../../../models/user'; // Import the User model
import bcrypt from 'bcrypt'
export default NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: {  label: 'Password',  type: 'password' },
      },
      async authorize(credentials) {
        // Connect to the database
        await connectDB();

        // Find the user by email or username
        const user = await User.findOne({
          $or: [{ email: credentials.username }, { username: credentials.username }],
        });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // If the password matches, return the user
          return Promise.resolve(user);
        } else {
          // If authentication fails, return null
          return Promise.resolve(null);
        }
      },
    }),
    // Add other authentication providers as needed (e.g., Google, GitHub)
  ],
  // Configure other NextAuth.js options as needed
});
