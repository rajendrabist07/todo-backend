import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI || (process.env.NODE_ENV !== 'production' ? 'mongodb://127.0.0.1:27017/authDB' : null);
        if (!uri) {
            throw new Error("Missing Mongo connection string. Set MONGO_URI (preferred) or MONGODB_URI in .env");
        }

        const connect = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (err) {
        console.log(`Connection Error: ${err.message}`);
        process.exit(1);
    };
}

export default connectDB;