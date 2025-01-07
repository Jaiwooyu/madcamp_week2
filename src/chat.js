import React, { useState, useEffect, useRef } from 'react';
import './commom.css';
import './chat.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [user, setUser] = useState(null);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();
    const petId = 3;  // 동적으로 받아오는 방식으로 수정 가능

    const [pet, setPet] = useState(null);  // pet 상태 추가
    const [loading, setLoading] = useState(true);  // loading 상태 추가
    const [error, setError] = useState(null);  // error 상태 추가

    // 사용자 정보 불러오기
    useEffect(() => {
        axios
          .get("http://localhost:8080/api/user", { withCredentials: true })
          .then((response) => {
            setUser(response.data);  // 사용자 데이터 저장
          })
          .catch(() => {
            navigate("/"); // 로그인되지 않은 경우 홈으로 리디렉트
          });
    }, [navigate]);

    // 봇의 프로필 사진 불러오기
    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/pets/${petId}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch pet data');
                }

                const data = await response.json();
                setPet(data);
                console.log(data.imageUrl);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPet();
    }, [petId]);

    // 메시지 자동 스크롤
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 이전 대화 불러오기
    useEffect(() => {
        const loadPreviousChat = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/chat/${petId}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (data) {
                    console.log(data);
    
                    // 메시지 파싱 및 정렬
                    const parsedMessages = data.map(item => ([
                        {
                            role: 'user',
                            content: item.userMessage,
                            timestamp: item.createdAt
                        },
                        {
                            role: 'assistant',
                            content: item.petResponse,
                            timestamp: item.createdAt
                        }
                    ])).flat();
    
                    // 타임스탬프 기준으로 정렬
                    const sortedMessages = parsedMessages.sort((a, b) => 
                        new Date(a.timestamp) - new Date(b.timestamp)
                    );
    
                    setMessages(sortedMessages);
                }
            } catch (error) {
                console.error('채팅 내역을 불러오는데 실패했습니다:', error);
            }
        };
        loadPreviousChat();
    }, [petId]);
    

    // 채팅 시작
    useEffect(() => {
        const startChat = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/chat/start/${petId}`, {
                    method: 'POST',
                    credentials: 'include'
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
    }, [petId]);

    // 메시지 전송
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
            const response = await fetch(`http://localhost:8080/api/chat/${petId}/message`, {
                method: 'POST',
                credentials: 'include',
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
            <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            Re:PET    
            </div>
                <div className="nav-links">
                    <span onClick={() => navigate('/record')}>기록하기</span>
                    <span onClick={() => navigate('/remember')}>추억하기</span>
                    <span onClick={() => navigate('/chat')}>대화하기</span>
                </div>
                <div className="profile">
                    {/* 사용자 프로필 이미지 */}
                    <img
                        src={user?.picture ? user.picture : '/default-profile.png'}
                        alt="User"
                        className="profile-pic"
                    />
                </div>
            </div>

            <div className="chat-box">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                        {message.role !== 'user' && (
                        <div className="avatar">
                            <img src={`http://localhost:8080${pet?.imageUrl || '/default-pet.png'}`} alt={`${pet?.name || '기본 펫'}`} />
                            </div>
                        )}
                        <div className="text">
                            {message.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="message assistant-message">
                        <div className="avatar">
                            <img src={`http://localhost:8080${pet?.imageUrl || '/default-pet.png'}`} alt={`${pet?.name || '기본 펫'}`} />
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
