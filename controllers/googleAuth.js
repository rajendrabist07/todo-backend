import User from '../models/googleAuth.js';
import { generateAuthToken } from '../application.js';
import { OAuth2Client } from 'google-auth-library';

// Only pass CLIENT_ID — no secret or redirect URI needed for verifyIdToken
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Google token is required" });
        }

        // verifyIdToken only needs the audience (your client ID)
        let payload;
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (verifyError) {
            console.error("Token verification failed:", verifyError);
            return res.status(401).json({ message: "Invalid or expired Google token" });
        }

        const { email, name, sub: googleId } = payload;

        if (!email || !googleId) {
            return res.status(400).json({ message: "Incomplete Google account data" });
        }

        // Find by googleId first, then fall back to email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
            // New user — create without password
            user = await User.create({
                name,
                email,
                googleId,
                isGoogleAuth: true,
                // Don't store googleId as password
                // Leave password undefined/null (make sure your schema allows this for Google users)
            });
        } else {
            // Existing user found by email — patch in googleId if missing
            let needsSave = false;

            if (!user.googleId) {
                user.googleId = googleId;
                needsSave = true;
            }
            if (!user.isGoogleAuth) {
                user.isGoogleAuth = true;
                needsSave = true;
            }

            if (needsSave) await user.save();
        }

        const auth_token = generateAuthToken(user);

        const data = {
            id: user._id,
            name: user.name,
            email: user.email,
            auth_token,
            isGoogleAuth: true,
        };

        return res.status(200).json({ message: "Google authentication successful", data });

    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ message: "Google authentication failed" });
    }
};