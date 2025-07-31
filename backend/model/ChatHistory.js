import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: String,
  isUser: Boolean,
  timestamp: { type: Date, default: Date.now }
});

const chatHistorySchema = new mongoose.Schema({
  username: { type: String, required: true },
  messages: [messageSchema]
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;
