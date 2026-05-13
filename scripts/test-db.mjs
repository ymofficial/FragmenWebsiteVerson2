import mongoose from 'mongoose';

async function check() {
  try {
    const uri = "mongodb+srv://yeasin500:yeasin@fragmen.z2b6b.mongodb.net/fragmen?retryWrites=true&w=majority";
    console.log("URI:", uri ? "Found" : "Not Found");
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}
check();
