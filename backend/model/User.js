import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
    },
    EmailID: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Mobile: {
        type: String, // or Number
        default: ""
    }
}, { collection: "FitBot" });


const User = mongoose.model("User", userSchema);
export default User;
