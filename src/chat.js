import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileTab from "./ProfileTab";
import trash from "./assets/images/trash.png"; // 이미지 import 추가
import detail from "./assets/images/detail.png"; // 이미지 import 추가

const Chat = () => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [showProfileTab, setShowProfileTab] = useState(false);
  const navigate = useNavigate();

  // 유저 정보 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => navigate("/"));
  }, [navigate]);

  // 반려동물 정보 가져오기
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:8080/api/pets", { withCredentials: true })
        .then((response) => {
          setPets(response.data);
        })
        .catch((error) => {
          console.error("펫 정보 불러오기 실패:", error);
        });
    }
  }, [user]);

  // 반려동물 삭제 처리
  const handleDeletePet = async (petId) => {
    if (window.confirm("정말로 이 반려동물의 정보를 삭제하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:8080/api/pets/${petId}`, {
          withCredentials: true,
        });
        setPets(pets.filter((pet) => pet.id !== petId));
      } catch (error) {
        console.error("펫 삭제 실패:", error);
      }
    }
  };

  // 채팅 시작
  const handleChatStart = (petId) => {
    navigate(`/chatdetail?petId=${petId}`);
  };

  const handlePetDetail = (petId) => {
    navigate(`/petDetail?petId=${petId}`);
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-gray-800 text-center mb-2">
          친구들이 보고 싶을 때,
        </h1>
        <h2 className="text-3xl text-gray-800 text-center mb-8">Re:PET</h2>

        {/* Pet Cards */}
        <div className="space-y-4">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleChatStart(pet.id)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:8080${pet.imageUrl}`}
                  alt={pet.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <span className="text-xl font-medium text-gray-800">
                  {pet.name}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {" "}
                {/* 두 버튼 사이 공간을 주기 위해 flex 컨테이너를 추가 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePetDetail(pet.id);
                  }}
                  className="p-2 rounded-full transition-colors w-12 h-12 flex items-center justify-center z-10" // 버튼 사이즈 조정
                >
                  <img
                    src={detail}
                    className="w-6 h-auto text-gray-500 hover:text-red-500" // 아이콘 크기 조정
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePet(pet.id);
                  }}
                  className="p-2 rounded-full transition-colors w-12 h-12 flex items-center justify-center" // 버튼 사이즈 조정
                >
                  <img
                    src={trash}
                    className="w-6 h-auto text-gray-500 hover:text-red-500" // 아이콘 크기 조정
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
