import User from '../models/user.js'; // ✅ Fixed import
import { generateAuthToken } from '../application.js';

export const googleAuth = async (req, res) => {
    try {
        const { access_token, userInfo } = req.body;

        // Validate the token by calling Google's userinfo endpoint server-side
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        if (!googleRes.ok) {
            return res.status(401).json({ message: "Invalid Google token" });
        }

        const googleData = await googleRes.json();

        // ✅ Use server-verified data, NOT what client sent
        const { email, name, sub: googleId } = googleData;

        if (!email || !googleId) {
            return res.status(400).json({ message: "Incomplete Google account data" });
        }

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                isGoogleAuth: true,
            });
        } else {
            let needsSave = false;
            if (!user.googleId) { user.googleId = googleId; needsSave = true; }
            if (!user.isGoogleAuth) { user.isGoogleAuth = true; needsSave = true; }
            if (needsSave) await user.save();
        }

        const auth_token = generateAuthToken(user);

        return res.status(200).json({
            message: "Google authentication successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                auth_token,
                isGoogleAuth: true,
            }
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ message: "Google authentication failed" });
    }
};