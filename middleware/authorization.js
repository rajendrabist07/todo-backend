import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const authorization = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : header.trim();
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "Server misconfigured: JWT secret missing" });
        }

        const data = jwt.verify(token, secret)

        const user = await User.findById(data.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user to request object

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }
        res.status(500).json({ message: "Internal server error" })
    }
}

export default authorization;