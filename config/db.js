const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://secureInmate:olami123@2virtual.zv9px8k.mongodb.net/SecureInmate?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,       
    });

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.red.bold);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

