const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://fragmenAdmin:680739@fragmen.hezkwu1.mongodb.net/fragmen?retryWrites=true&w=majority&appName=fragmen";

async function main() {
  const client = new MongoClient(uri, { tls: true, tlsAllowInvalidCertificates: false });
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!');
    
    const db = client.db('fragmen');
    const users = db.collection('users');
    
    const password = await bcrypt.hash('admin123', 12);
    
    await users.updateOne(
      { email: 'admin@fragmen.com' },
      { $set: { name: 'Admin', email: 'admin@fragmen.com', password, role: 'admin', createdAt: new Date() } },
      { upsert: true }
    );
    
    console.log('✅ Admin user created!');
    console.log('   Email:    admin@fragmen.com');
    console.log('   Password: admin123');
  } finally {
    await client.close();
  }
}

main().catch(console.error);
