import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const authorization = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Extract token (supports both "Bearer token" and just "token")
        let token = authHeader;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7).trim();
        } else {
            token = authHeader.trim();
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Invalid token format" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET not configured");
            return res.status(500).json({ message: "Server configuration error" });
        }

        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authorization Error:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }

        res.status(500).json({ message: "Internal server error during authorization" });
    }
};

export default authorization;