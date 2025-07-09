// import videos from "./video2.mp4";
// import "./Home.css";
// import bot from "./bot.png";
// import user from "./user.png";
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import sent from "./sent.jpg";

// const Home = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isInput, setIsInput] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [showBotMessage, setShowBotMessage] = useState(false);
//     const messagesEndRef = useRef();

//     const openChat = () => {
//         setIsOpen(!isOpen);
//     };

//     const speakText = (text) => {
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = 'en-US';
//         speechSynthesis.speak(utterance);
//     };

//     function changeInput(e) {
//         setIsInput(e.target.value);
//     }

//     async function sendMessage() {
//         if (isInput.trim()) {
//             const newMessage = { text: isInput, isUser: true };
//             setMessages([...messages, newMessage]);
//             setIsInput("");
//             const response = await axios.get(`http://localhost:8000/chat?text=${isInput}`);
//             const result = response.data.response;
//             setTimeout(() => {
//                 const botMessage = { text: result, isUser: false };
//                 setMessages((prevMessages) => [...prevMessages, botMessage]);
//             }, 1000);
//         }
//     }

//     useEffect(() => {
//         setTimeout(() => {
//             setShowBotMessage(true);
//         }, 2000);
//         return () => clearTimeout();
//     }, [isOpen]);

//     const clickEnter = (e) => {
//         if (e.key === "Enter") sendMessage();
//     };

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     return (
//         <>
//             <div className="video-container">
//                 <video autoPlay muted loop className="background-video">
//                     <source src={videos} type="video/mp4" />
//                     Your browser does not support HTML5 video.
//                 </video>
//                 <div className="onVideo">
//                     <div className="inside-video">
//                         <h1>BEGIN YOUR FITNESS JOURNEY</h1>
//                         <button className="video-btn" onClick={openChat}>Get Started</button>
//                     </div>
//                 </div>
//             </div>

//             <div className="model-container">
//                 <button><img className="model-image" alt="bot-Image" onClick={openChat} src={bot} /></button>
//             </div>

//             <div>
//                 {isOpen && (
//                     <div className="chatbot">
//                         <h3>Chat With Bot</h3>
//                         <div className="chat-messages">
//                             {showBotMessage && (
//                                 <div className="chat-bubble bot">
//                                     <img className="chat-image" src={bot} alt="Bot" />
//                                     <p>How Can I Help You ?</p>
//                                 </div>
//                             )}
//                             {messages.map((msg, index) => (
//                                 <div key={index} className={`chat-bubble ${msg.isUser ? "user" : "bot"}`}>
//                                     {msg.isUser && <img className="chat-image" src={user} alt="User" />}
//                                     {!msg.isUser && <img className="chat-image" src={bot} alt="Bot" />}
//                                     <div style={{ display: "flex", flexDirection: "column" }}>
//                                         <p>{msg.text}</p>
//                                         {!msg.isUser && (
//                                             <svg
//                                                 onClick={() => speakText(msg.text)}
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 width="20"
//                                                 height="20"
//                                                 viewBox="0 0 24 24"
//                                                 fill="currentColor"
//                                                 style={{ cursor: "pointer", marginTop: "5px", alignSelf: "flex-start" }}
//                                                 title="Speak message"
//                                             >
//                                                 <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.33-1.46 4.31-3.5 5.11V18h2v2h-7v-2h2v-1.89C8.46 15.31 7 13.33 7 11H5c0 3.07 2.13 5.64 5 6.32V21h4v-3.68c2.87-.68 5-3.25 5-6.32h-2z" />
//                                             </svg>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                             <div ref={messagesEndRef} />
//                         </div>
//                         <div className="chat-input">
//                             <textarea
//                                 autoFocus
//                                 placeholder="Ask a question . . ."
//                                 value={isInput}
//                                 onChange={changeInput}
//                                 spellCheck="false"
//                                 required
//                                 onKeyDown={clickEnter}
//                             ></textarea>
//                             <button onClick={sendMessage}><img className="chat-image" src={sent} /></button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }

// export default Home;
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

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const openChat = () => {
        setIsOpen(!isOpen);
    };

    const speakText = (text) => {
        stopSpeaking(); // stop if already speaking
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
            const response = await axios.get(`http://localhost:8000/chat?text=${textToSend}`);
            const result = response.data.response;
            setTimeout(() => {
                const botMessage = { text: result, isUser: false };
                setMessages(prev => [...prev, botMessage]);
            }, 1000);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setShowBotMessage(true);
        }, 2000);
        return () => clearTimeout();
    }, [isOpen]);

    const clickEnter = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!listening && transcript.trim()) {
            sendMessage();
        }
        // eslint-disable-next-line
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
                <button><img className="model-image" alt="bot-Image" onClick={openChat} src={bot} /></button>
            </div>

            <div>
                {isOpen && (
                    <div className="chatbot">
                        <h3>Chat With Bot</h3>
                        <div className="chat-messages">
                            {showBotMessage && (
                                <div className="chat-bubble bot">
                                    <img className="chat-image" src={bot} alt="Bot" />
                                    <p>How Can I Help You ?</p>
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

                            {/* 🎤 Mic Button */}
                            <button
                                onClick={() => {
                                    stopSpeaking();
                                    resetTranscript();
                                    SpeechRecognition.startListening({ continuous: false });
                                }}
                                title={listening ? "Listening..." : "Speak"}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill={listening ? "red" : "black"}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.33-1.46 4.31-3.5 5.11V18h2v2h-7v-2h2v-1.89C8.46 15.31 7 13.33 7 11H5c0 3.07 2.13 5.64 5 6.32V21h4v-3.68c2.87-.68 5-3.25 5-6.32h-2z" />
                                </svg>
                            </button>

                            {/* 🛑 Stop Speaking Button */}
                            <button onClick={stopSpeaking} title="Stop Speaking">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="darkred" viewBox="0 0 24 24">
                                    <path d="M6 6h12v12H6z" />
                                </svg>
                            </button>

                            {/* 📩 Send Button */}
                            <button onClick={sendMessage}><img className="chat-image" src={sent} /></button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;

