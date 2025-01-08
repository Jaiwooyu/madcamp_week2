import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import ProfileTab from "./ProfileTab";

const Chatdetail = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const [showProfileTab, setShowProfileTab] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("petId");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => navigate("/"));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8080/api/pets/${petId}`, {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data) {
            setPet(response.data);
          }
        })
        .catch((error) => {
          console.error("펫 정보 불러오기 실패:", error);
        });
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadPreviousChat = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/chat/${petId}`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data) {
          const parsedMessages = data
            .map((item) => [
              {
                role: "user",
                content: item.userMessage,
                timestamp: item.createdAt,
              },
              {
                role: "assistant",
                content: item.petResponse,
                timestamp: item.createdAt,
              },
            ])
            .flat();
          const sortedMessages = parsedMessages.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
          setMessages(sortedMessages);
        }
      } catch (error) {
        console.error("채팅 내역을 불러오는데 실패했습니다:", error);
      }
    };
    loadPreviousChat();
  }, [petId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/chat/${petId}/message`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );
      const data = await response.json();

      const botMessage = {
        role: "assistant",
        content: data.petResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="text-2xl font-bold text-gray-600 cursor-pointer hover:text-black-500 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Re:PET
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("/record")}
              className="text-gray-600 hover:text-yellow-400 transition-colors"
            >
              기록하기
            </button>
            <button
              onClick={() => navigate("/remember")}
              className="text-gray-600 hover:text-yellow-400 transition-colors"
            >
              추억하기
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              대화하기
            </button>
          </div>

          <div className="relative">
            <img
              src={user?.picture || "/default-profile.png"}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-yellow-200 hover:border-yellow-400 transition-colors cursor-pointer"
              onClick={() => setShowProfileTab(!showProfileTab)}
            />
            {showProfileTab && (
              <ProfileTab
                user={user}
                onClose={() => setShowProfileTab(false)}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Chat Messages */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 h-[calc(100vh-280px)] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {message.role !== "user" && (
                  <div className="flex-shrink-0">
                    <img
                      src={`http://localhost:8080${
                        pet?.imageUrl || "/default-pet.png"
                      }`}
                      alt={pet?.name || "Pet"}
                      className="w-10 h-10 rounded-full border-2 border-yellow-200"
                    />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                    message.role === "user"
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={`http://localhost:8080${
                      pet?.imageUrl || "/default-pet.png"
                    }`}
                    alt={pet?.name || "Pet"}
                    className="w-10 h-10 rounded-full border-2 border-yellow-200"
                  />
                </div>
                <div className="px-4 py-2 rounded-2xl bg-gray-100">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatdetail;
