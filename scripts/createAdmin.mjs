// Run with: node scripts/createAdmin.mjs
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env.local');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const email = 'admin@fragmen.com';
const password = await bcrypt.hash('admin123', 12);

await User.findOneAndUpdate(
  { email },
  { name: 'Admin', email, password, role: 'admin' },
  { upsert: true, new: true }
);

console.log('✅ Admin user created/updated!');
console.log('   Email:    admin@fragmen.com');
console.log('   Password: admin123');
console.log('   ⚠️  Change password after first login!');

await mongoose.disconnect();
