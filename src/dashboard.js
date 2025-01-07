import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProfileTab from "./ProfileTab";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const navigate = useNavigate();
  const [showProfileTab, setShowProfileTab] = useState(false);
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:8080/api/pets", { withCredentials: true })
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setPet(response.data[0]);
          }
        })
        .catch((error) => {
          console.error("펫 정보 불러오기 실패:", error);
        });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div 
            className="text-2xl font-bold text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Re:PET
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => navigate("/record")}
              className={`transition-colors ${
                location.pathname === "/record" 
                  ? "text-yellow-400" 
                  : "text-gray-600 hover:text-yellow-400"
              }`}
            >
              기록하기
            </button>
            <button 
              onClick={() => navigate("/remember")}
              className={`transition-colors ${
                location.pathname === "/remember" 
                  ? "text-yellow-400" 
                  : "text-gray-600 hover:text-yellow-400"
              }`}
            >
              추억하기
            </button>
            <button 
              onClick={() => navigate("/chat")}
              className={`transition-colors ${
                location.pathname === "/chat" 
                  ? "text-yellow-400" 
                  : "text-gray-600 hover:text-yellow-400"
              }`}
            >
              대화하기
            </button>
          </div>

          {/* Profile Picture with Tab */}
          <div className="relative">
            <img
              src={user?.picture || "/default-profile.png"}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-yellow-200 hover:border-yellow-400 transition-colors cursor-pointer"
              onClick={() => setShowProfileTab(!showProfileTab)}
            />
            {showProfileTab && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50">
                <ProfileTab user={user} onClose={() => setShowProfileTab(false)} />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content - 나머지 코드는 그대로 유지 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ... 기존 main 내용 유지 ... */}
      </main>
    </div>
  );
};

export default Dashboard;