// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import signup from "./Routes/Login.js";
// import register from "./Routes/Register.js";
// import chat from "./Routes/Chat.js"
// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(express.json());
// app.options('*', cors());

// app.use(cors());
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
//         console.log("Database Connected!!");
//     } catch (error) {
//         console.error("Database Connection Error:", error);
//     }
// })();
// app.use('/SignIn', signup);
// app.use('/Register', register);
// app.use('/chat',chat);
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import signup from "./Routes/Login.js";
import register from "./Routes/Register.js";
import chat from "./Routes/Chat.js";
import forgotPassword from "./Routes/ForgotPassword.js"; // ✅ Import route

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.options('*', cors());
app.use(cors());

// ✅ Connect to MongoDB
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log("Database Connected!!");
    } catch (error) {
        console.error("Database Connection Error:", error);
    }
})();

// ✅ API Routes
app.use('/SignIn', signup);
app.use('/Register', register);
app.use('/chat', chat);
app.use('/ForgotPassword', forgotPassword);     // For sending reset email
app.use('/ChangePassword', forgotPassword);     // For changing password

// ✅ Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
