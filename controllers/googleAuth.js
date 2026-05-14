import User from '../models/user.js';
import { generateAuthToken } from '../application.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.FRONTEND_URL}/auth/google/callback`
);

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Google token is required" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name,
                email: email,
                password: googleId, // Store Google ID as password (won't be used for Google auth)
                googleId: googleId,
                isGoogleAuth: true
            });
        }

        const auth_token = generateAuthToken(user);

        const data = {
            id: user._id,
            name: user.name,
            email: user.email,
            auth_token,
            isGoogleAuth: true
        };

        res.status(200).json({ message: "Google authentication successful", data });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Google authentication failed" });
    }
};