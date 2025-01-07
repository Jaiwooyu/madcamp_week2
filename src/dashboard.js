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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {pet ? (
          // Pet Chat Section
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Pet Image */}
              <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-yellow-100">
                <img
                  src={`http://localhost:8080${
                    pet.imageUrl || "/default-pet.png"
                  }`}
                  alt="반려동물"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Chat Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  "친구야, 잘 지냈어?"
                </h2>
                <button
                  onClick={() => navigate("/chat")}
                  className="px-8 py-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors shadow-md"
                >
                  대화하기
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Welcome Section
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                안녕, 나의 친구
              </h2>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                잘 가, 나의 가족
              </h2>
              <button
                onClick={() => navigate("/record")}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-white rounded-full hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg"
              >
                반려 가족 정보 기록하기
              </button>
            </div>

            <div className="flex justify-center">
              <img
                src="/golden-retriever.png"
                alt="골든 리트리버"
                className="max-w-md w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
