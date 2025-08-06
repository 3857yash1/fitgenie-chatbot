import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "../model/ChatHistory.js";

dotenv.config();
const router = express.Router();

// Function to call Gemini API
async function askQuestion(UserInput) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `The user has asked a question: ${UserInput}. Respond if the question relates to workouts (such as exercise routines, tips for specific muscle groups, or fitness advice), meal plans (including diet plans, meal suggestions, or healthy recipes), or nutritional information about foods (like "What nutrients are in eggs?" or "How much protein does a banana have?"). Provide a brief and relevant answer to fitness-related queries. Also provide video reference if user asked. If the question is not related to workouts, meals, or nutrition, respond with "I can assist only with questions about workouts, meal plans, and food nutrition."`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error in Gemini API:", error);
    throw new Error("Failed to generate response");
  }
}

// POST /chat - handle user message and respond
router.post("/", async (req, res) => {
  const { text, username } = req.body;

  if (!text || !username) {
    return res.status(400).json({ error: "Missing text or username" });
  }

  console.log("Received message:", text);
  console.log("From user:", username);

  try {
    const botResponse = await askQuestion(text);
    console.log("Bot response:", botResponse);

    const userMessage = { text, isUser: true };
    const botMessage = { text: botResponse, isUser: false };

    let chat = await ChatHistory.findOne({ username });
    if (!chat) {
      chat = new ChatHistory({ username, messages: [userMessage, botMessage] });
    } else {
      chat.messages.push(userMessage, botMessage);
    }

    await chat.save();
    res.json({ response: botResponse });
  } catch (err) {
    console.error("Gemini Chat Error:", err);
    res.status(500).json({ error: "Chat error" });
  }
});

// ✅ FIXED: GET /chat/history/:username
router.get("/history/:username", async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({ username: req.params.username });
    console.log("Fetched history for", req.params.username, chat?.messages || []);
    res.json(chat?.messages || []);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
