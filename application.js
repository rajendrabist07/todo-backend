import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

const compareHash = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
};

const privateKey = process.env.JWT_SECRET;

const generateAuthToken = (user) => {
    if (!privateKey) {
        throw new Error("JWT_SECRET is not configured in environment variables");
    }

    const payload = {
        id: user._id,
        name: user.name,
        email: user.email
    };

    return jwt.sign(payload, privateKey, { expiresIn: '7d' }); // Extended to 7 days
};

export { generateAuthToken, generateHash, compareHash };