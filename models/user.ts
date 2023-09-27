// models/User.js
// models/user.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  // Add other user fields as needed
}

const userSchema = new Schema<UserDocument>({
  name: String,
  email: String,
  password: String,
  // Define other schema fields here
});

const UserModel = mongoose.models.Usuario || mongoose.model<UserDocument>('Usuario', userSchema);

export default UserModel;
