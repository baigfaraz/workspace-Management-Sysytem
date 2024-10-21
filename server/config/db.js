import mongoose from "mongoose"; // Use import instead of require
import dotenv from "dotenv"; // Import dotenv to load environment variables

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB connected! You are good to GO!");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; // Use export default instead of module.exports
