import React, { useState, useEffect, useRef, useContext } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import BeatLoader from "react-spinners/BeatLoader";
import { useWebsite } from "../../Context/WebsiteContext";

import "./AskQuestion.css";

const AskQuestion = ({ isOpen, onClose }) => {
  const { websiteValue, extractDomain } = useWebsite();
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const handleChange = (e) => {
    setQuestion(e.target.value);
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
  };
  console.log(websiteValue, "websiteValue");

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      alert("Please enter a valid question.");
      return;
    }

    setLoading(true);
    const uniqueId = generateUniqueId();

    const userMessage = {
      id: uniqueId,
      text: question,
      from: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const domain = extractDomain(websiteValue);

    try {
      const response = await fetch(
        "https://asksandy-server.fly.dev/api/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question, url: domain }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const botMessage = {
        id: generateUniqueId(),
        text: data,
        from: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Failed to get a response from the server. Please try again later."
      );
    } finally {
      setLoading(false);
    }

    setQuestion("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`ask-question-panel ${isOpen ? "open" : ""}`}>
      <div className="close-btn" onClick={onClose}>
        &times;
      </div>
      <div className="content">
        <h2>Ask Your Question</h2>
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.from}`}>
              <div className="profile">
                <img
                  src={
                    message.from === "bot"
                      ? "https://www.techopedia.com/wp-content/uploads/2023/03/6e13a6b3-28b6-454a-bef3-92d3d5529007.jpeg"
                      : "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
                  }
                  alt={message.from}
                  className={message.from}
                />
              </div>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="profile">
                <img
                  src="https://www.techopedia.com/wp-content/uploads/2023/03/6e13a6b3-28b6-454a-bef3-92d3d5529007.jpeg"
                  alt="bot"
                />
              </div>
              <BeatLoader color={"#4a4e69"} loading={true} />
            </div>
          )}
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <textarea
                value={question}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
              />
              <button type="submit" className="send-btn">
                <RiSendPlaneFill />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
