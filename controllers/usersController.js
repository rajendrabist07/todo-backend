import User from '../models/user.js';
import { compareHash, generateAuthToken, generateHash } from '../application.js';

async function signup(req, res) {
    try {
        let { name, email, password } = req.body;
        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "name is required" });
        }
        if (!email || typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "email is required" });
        }
        if (!password || typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters" });
        }

        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedpassword = await generateHash(password);
        let newuser = await User.create({ name, email, password: hashedpassword })

        let auth_token = generateAuthToken(newuser)

        let data = {
            id: newuser._id,
            name: newuser.name,
            email: newuser.email,
            auth_token
        }

        res.status(201).json({ message: "Signup successful", data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function login(req, res) {
    try {
        let { email, password } = req.body;
        if (!email || typeof email !== "string" || !email.trim()) {
            return res.status(400).json({ message: "email is required" });
        }
        if (!password || typeof password !== "string") {
            return res.status(400).json({ message: "password is required" });
        }

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        let isCorrect = await compareHash(password, user.password)

        if (!isCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }



        const auth_token = generateAuthToken(user)

        let data = {
            id: user._id,
            name: user.name,
            email: user.email,
            auth_token
        }

        res.status(200).json({
            data
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}





export { signup, login }