// PetDetail.js
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ProfileTab from "./ProfileTab";

const PetDetail = () => {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get("petId");
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [showProfileTab, setShowProfileTab] = useState(false);
  const navigate = useNavigate();

  // 유저 정보 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((response) => setUser(response.data))
      .catch(() => navigate("/"));
  }, [navigate]);

  // 펫 정보 가져오기
  useEffect(() => {
    if (user && petId) {
      axios
        .get(`http://localhost:8080/api/pets/${petId}`, {
          withCredentials: true,
        })
        .then((response) => {
          setPet(response.data);
        })
        .catch((error) => {
          console.error("펫 정보 불러오기 실패:", error);
        });
    }
  }, [user, petId]);

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
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column: Image */}
            <div className="space-y-4">
              <div className="relative w-full h-96">
                <img
                  src={`http://localhost:8080${pet?.imageUrl}`}
                  alt={pet?.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Right Column: Pet Info */}
            <div className="h-full flex flex-col justify-between">
              {" "}
              {/* 변경된 부분 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  이름
                </div>
                <div className="col-span-2 p-4 border rounded-lg">
                  {pet?.name}
                </div>

                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  생일
                </div>
                <div className="col-span-2 p-4 border rounded-lg">
                  {pet?.birthDate}
                </div>

                <div className="bg-gray-100 p-4 rounded-lg text-center">종</div>
                <div className="col-span-2 p-4 border rounded-lg">
                  {pet?.species}
                </div>

                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  성별
                </div>
                <div className="col-span-2 p-4 border rounded-lg">
                  {pet?.gender}
                </div>
              </div>
              <div className="flex justify-end mt-8">
                {" "}
                {/* 단순화된 버튼 컨테이너 */}
                <button
                  onClick={() => navigate(`/record?petId=${petId}`)}
                  className="px-6 py-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors"
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
