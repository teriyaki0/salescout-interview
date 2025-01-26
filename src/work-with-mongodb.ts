import mongoose from "mongoose";

type DuplicatedUsers = {
  email: string;
};

async function connectDB() {
  try {
    await mongoose.connect("mongodb://root:example@localhost:27017/mydatabase");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

async function manageUsers(): Promise<DuplicatedUsers[]> {
  await connectDB();

  const users = [
    { email: "user1@example.com", name: "User One" },
    { email: "user2@example.com", name: "User Two" },
    { email: "user1@example.com", name: "User Three" },
  ];

  try {
    await User.insertMany(users);
    console.log("Users added");
  } catch (error) {
    console.error("Error adding users:", error);
  }

  const duplicates = await User.aggregate([
    { $group: { _id: "$email", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $project: { email: "$_id", _id: 0 } },
  ]);

  // Закрытие соединения после операции
  await mongoose.connection.close();
  console.log("MongoDB connection closed");

  return duplicates;
}

export { manageUsers };
