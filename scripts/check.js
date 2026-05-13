const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yeasin500:yeasin@fragmen.z2b6b.mongodb.net/fragmen?retryWrites=true&w=majority";

async function check() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  const p = await Product.findOne().sort({ createdAt: -1 }).lean();
  console.log(JSON.stringify(p, null, 2));
  process.exit(0);
}

check();
