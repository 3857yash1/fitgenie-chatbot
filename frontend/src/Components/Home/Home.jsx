import videos from "./video2.mp4";
import "./Home.css";
import bot from "./bot.png";
import user from "./user.png";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import sent from "./sent.jpg";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Home = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isInput, setIsInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [showBotMessage, setShowBotMessage] = useState(false);
    const messagesEndRef = useRef();

    const username = "SAIKUMAR";

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const openChat = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (!isOpen) {
            fetchHistory(); // Load history only when opening
        }
    };


    // const openChat = () => {
    //     setIsOpen(!isOpen);
    // };

    const speakText = (text) => {
        stopSpeaking();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
    };

    function changeInput(e) {
        stopSpeaking();
        setIsInput(e.target.value);
    }

    async function sendMessage() {
        const textToSend = isInput || transcript;
        if (textToSend.trim()) {
            const newMessage = { text: textToSend, isUser: true };
            setMessages(prev => [...prev, newMessage]);
            setIsInput("");
            resetTranscript();
            try {
                const response = await axios.post(`http://localhost:8000/chat`, {
                    text: textToSend,
                    username: username
                });
                const result = response.data.response;
                setTimeout(() => {
                    const botMessage = { text: result, isUser: false };
                    setMessages(prev => [...prev, botMessage]);
                }, 1000);
            } catch (error) {
                const botMessage = { text: "❌ Could not get response from bot", isUser: false };
                setMessages(prev => [...prev, botMessage]);
            }
        }
    }

    async function fetchHistory() {
        try {
            const res = await axios.get(`http://localhost:8000/chat/history/${username}`);
            const historyMessages = res.data.map((msg) => ({ text: msg.text, isUser: msg.isUser }));
            setMessages(historyMessages);
        } catch (err) {
            console.error("Failed to load history:", err);
        }
    }

    const clickEnter = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    useEffect(() => {
        setTimeout(() => {
            setShowBotMessage(true);
        }, 2000);
        return () => clearTimeout();
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!listening && transcript.trim()) {
            sendMessage();
        }
    }, [listening]);

    return (
        <>
            <div className="video-container">
                <video autoPlay muted loop className="background-video">
                    <source src={videos} type="video/mp4" />
                    Your browser does not support HTML5 video.
                </video>
                <div className="onVideo">
                    <div className="inside-video">
                        <h1>BEGIN YOUR FITNESS JOURNEY</h1>
                        <button className="video-btn" onClick={openChat}>Get Started</button>
                    </div>
                </div>
            </div>

            <div className="model-container">
                <img className="model-image" alt="bot-Image" onClick={openChat} src={bot} />
            </div>

            {isOpen && (
                <div className="chatbot">
                    {/* ❌ Close button outside top-right */}
                    <button className="close-btn outside" onClick={openChat}>❌</button>

                    <div className="chat-header">
                        <h3>Chat With Bot</h3>
                    </div>

                    <div className="chat-messages">
                        {showBotMessage && (
                            <div className="chat-bubble bot">
                                <img className="chat-image" src={bot} alt="Bot" />
                                <p><strong>How Can I Help You?</strong></p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-bubble ${msg.isUser ? "user" : "bot"}`}>
                                {msg.isUser && <img className="chat-image" src={user} alt="User" />}
                                {!msg.isUser && <img className="chat-image" src={bot} alt="Bot" />}
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <p>{msg.text}</p>
                                    {!msg.isUser && (
                                        <svg
                                            onClick={() => speakText(msg.text)}
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            style={{ cursor: "pointer", marginTop: "5px", alignSelf: "flex-start" }}
                                            title="Speak message"
                                        >
                                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.33-1.46 4.31-3.5 5.11V18h2v2h-7v-2h2v-1.89C8.46 15.31 7 13.33 7 11H5c0 3.07 2.13 5.64 5 6.32V21h4v-3.68c2.87-.68 5-3.25 5-6.32h-2z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input">
                        <textarea
                            autoFocus
                            placeholder="Ask a question . . ."
                            value={isInput}
                            onChange={changeInput}
                            spellCheck="false"
                            required
                            onKeyDown={clickEnter}
                        ></textarea>

                        <div className="chat-controls">
                            <button onClick={() => {
                                stopSpeaking();
                                resetTranscript();
                                SpeechRecognition.startListening({ continuous: false });
                            }} title={listening ? "Listening..." : "Speak"}>🎤</button>

                            <button onClick={stopSpeaking} title="Stop Speaking">🛑</button>

                            <button onClick={() => {
                                setMessages([]);
                                setShowBotMessage(true);
                            }} title="New Chat">🆕</button>

                            <button onClick={fetchHistory} title="Chat History">📜</button>

                            <button onClick={sendMessage}><img className="chat-image" src={sent} alt="Send" /></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
