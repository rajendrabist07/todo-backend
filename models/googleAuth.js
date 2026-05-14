import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,

        required: function () {
            return !this.isGoogleAuth;
        }
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true,
    },
    isGoogleAuth: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);