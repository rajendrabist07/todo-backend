import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateHash = async (Password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(Password, salt);
    return hash;
}

const compareHash = async (Password, hashPassword) => {
    const isMatch = await bcrypt.compare(Password, hashPassword);
    return isMatch;
}

const privateKey = process.env.JWT_SECRET || "my_secret"

const generateAuthToken = (user) => {
    const data = {
        id: user._id,
        name: user.name
    }

    return jwt.sign(data, privateKey, { expiresIn: '1day' });

}

export { generateAuthToken, generateHash, compareHash }