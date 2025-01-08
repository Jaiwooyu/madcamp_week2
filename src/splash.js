import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./commom.css";
import "./splash.css";
import axios from "axios";
import ProfileTab from "./ProfileTab";

const Splash = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileTab, setShowProfileTab] = useState(false);
  const location = useLocation();

  // 사용자 정보 불러오기,
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((response) => {
        setUser(response.data); // 사용자 데이터 저장
      })
      .catch(() => {
        navigate("/"); // 로그인되지 않은 경우 홈으로 리디렉트
      });
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
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
              className="text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              기록하기
            </button>
            <button
              onClick={() => {
                navigate("/remember");
              }}
              className="text-gray-600 hover:text-yellow-400 transition-colors"
            >
              추억하기
            </button>
            <button
              onClick={() => {
                navigate("/chat");
              }}
              className="text-gray-600 hover:text-yellow-400 transition-colors"
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

      <div className="splash-content">
        <h1 className="splash-text">기록하기가 완료됐어요!</h1>
        <div className="circle-decoration">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
