import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProfileTab from "./ProfileTab";
import dogimg from "./assets/images/dog.png"; // 이미지 import 추가

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
            className="text-2xl font-bold text-gray-600 cursor-pointer hover:text-black-500 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Re:PET
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("/record")}
              className="text-gray-600 hover:text-yellow-400 transition-colors"
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

          {/* Profile Picture */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* 상단 여백 추가 */}
        {pet ? (
          // Pet Chat Section with Polaroid style
          <div className="flex justify-center items-center gap-0">
            {" "}
            {/* justify-between을 center로 변경하고 gap 추가 */}
            {/* Polaroid Section - left side */}
            <div className="relative flex-shrink-0 ml-20">
              {" "}
              {/* 왼쪽 마진 추가 */}
              {/* White Polaroid frame behind */}
              <div className="absolute -left-4 -top-4 w-[500px] h-[600px] bg-white rounded-lg shadow-lg transform rotate-[-2deg]"></div>
              {/* Main Polaroid frame */}
              <div className="relative w-[500px] h-[600px] bg-white rounded-lg shadow-xl p-6">
                {/* Image container */}
                <div className="w-full h-[500px] bg-gray-100">
                  <img
                    src={`http://localhost:8080${
                      pet.imageUrl || "/default-pet.png"
                    }`}
                    alt="반려동물"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            {/* Text and Button Section - right side */}
            <div className="flex flex-col items-center justify-center flex-1">
              <h2 className="text-4xl font-inria-bold text-gray-800 mb-10">
                "친구야, 잘 지냈어?"
              </h2>
              <h3 className="text-2xl font-inria-bold text-gray-800 mb-4">
                오랜만에 같이 대화를 나눠보세요
              </h3>
              <button
                onClick={() => navigate("/chat")}
                className="px-10 py-4 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors shadow-md text-lg"
              >
                대화하기
              </button>
            </div>
          </div>
        ) : (
          // Welcome Section
          <div className="flex flex-col items-center justify-center grid grid-cols-2">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-inria-bold text-gray-800 mb-2">
                안녕, 나의 친구
              </h2>
              <h2 className="text-3xl font-inria-bold text-gray-800 mb-6">
                잘 가, 나의 가족
              </h2>
              <button
                onClick={() => navigate("/record")}
                className="px-8 py-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors shadow-md"
              >
                반려 가족 정보 기록하기
              </button>
            </div>
            <img
              src={dogimg}
              alt="골든 리트리버"
              className="max-w-md rounded-3xl w-full h-auto"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
