import React, { useState, useEffect, useRef } from 'react';
import './chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
   
    const petId = 3;  // 동적으로 받아오는 방식으로 수정 가능
   
    // 메시지 자동 스크롤
    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
   
    // 이전 대화 불러오기
    useEffect(() => {
      const loadPreviousChat = async () => {
        try {
          const response = await fetch(`http://localhost:8080/start/${petId}`, {
           withCredentials: true
          });
          const data = await response.json();
          if (data) {
            setMessages(data);
          }
        } catch (error) {
          console.error('채팅 내역을 불러오는데 실패했습니다:', error);
        }
      };
      loadPreviousChat();
    }, [petId]);
   
    const sendMessage = async () => {
      if (!input.trim()) return;
   
      const userMessage = {
        role: 'user',
        content: input,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);
   
      try {
        const response = await fetch(`http://localhost:8080/chat/${petId}/message`, {
          method: 'POST',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input })
        });
        const data = await response.json();
   
        const botMessage = {
          role: 'assistant',
          content: data.petResponse,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('메시지 전송 실패:', error);
      } finally {
        setIsTyping(false);
      }
    };
   
    const startChat = async () => {
      try {
        const response = await fetch(`http://localhost:8080/chat/start/${petId}`, {
          method: 'POST',
          withCredentials: true
        });
        const data = await response.json();
        const initialMessage = {
          role: 'assistant',
          content: data.petResponse,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, initialMessage]);
      } catch (error) {
        console.error('채팅 시작 실패:', error);
      }
    };
   
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };
   
    useEffect(() => {
      if (window.location.pathname !== '/chat') {
        window.history.pushState({}, '', '/chat');
      }
    }, []);
   
    const handleNavigation = (path) => {
      window.history.pushState({}, '', `/${path}`);
      window.location.reload();
    };
   
    return (
      <div className="chat-container">
        <div className="navbar">
          <div className="logo">Re:PET</div>
          <div className="nav-links">
            <span onClick={() => handleNavigation('record')}>기록하기</span>
            <span onClick={() => handleNavigation('remember')}>기억하기</span>
            <span className="active">대화하기</span>
            <span>이용 가이드</span>
          </div>
        </div>
   
        <div className="chat-box">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
              {message.role !== 'user' && (
                <div className="avatar">
                  <img src="/default-profile.png" alt="Assistant" />
                </div>
              )}
              <div className="text">
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="avatar">
                  <img src="/user-profile.png" alt="User" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="message assistant-message">
              <div className="avatar">
                <img src="/default-profile.png" alt="Assistant" />
              </div>
              <div className="text typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
   
        <div className="input-box">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage} className="send-button">
            전송
          </button>
        </div>
      </div>
    );
   };
   
   export default Chat;
   