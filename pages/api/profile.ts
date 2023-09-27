// pages/api/profile.js

import connectDB from '../../utils/db';
import User from '../../models/User';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (session) {
    try {
      // Connect to the database
      await connectDB();

      // Find the user by their ID
      const user = await User.findById(session.user.id);

      if (user) {
        // Return the user's profile information
        res.status(200).json({
          name: user.name,
          email: user.email,
          // Include other profile information as needed
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}
