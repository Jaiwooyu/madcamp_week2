import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./commom.css";
import "./dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const navigate = useNavigate();

  // 사용자 정보 불러오기,
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

  // 반려동물 정보 불러오기
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:8080/api/pets", { withCredentials: true })
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setPet(response.data[0]); // 첫 번째 반려동물 정보 저장
          }
        })
        .catch((error) => {
          console.error("펫 정보 불러오기 실패:", error);
        });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="dashboard">
      <div className="navbar">
        <div
          className="logo"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          Re:PET
        </div>
        <div className="nav-links">
          <span onClick={() => navigate("/record")}>기록하기</span>
          <span onClick={() => navigate("/remember")}>추억하기</span>
          <span onClick={() => navigate("/chat")}>대화하기</span>
        </div>
        <div className="profile">
          {/* 사용자 프로필 이미지 */}
          <img
            src={user?.picture ? user.picture : "/default-profile.png"}
            alt="User"
            className="profile-pic"
          />
        </div>
      </div>

      <div className="content">
        {pet ? (
          // 반려동물이 있는 경우
          <div className="pet-chat">
            <div className="chat-card">
              <div className="pet-image">
                <img
                  src={`http://localhost:8080${
                    pet.imageUrl || "/default-pet.png"
                  }`}
                  alt="반려동물"
                />
              </div>
              <div className="chat-info">
                <h2>"친구야, 잘 지냈어?"</h2>
                <div className="button-group">
                  <button
                    onClick={() => navigate("/chat")}
                    className="chat-button"
                  >
                    대화하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 반려동물이 없는 경우
          <div className="no-pet">
            <div className="welcome-card">
              <h2>안녕, 나의 친구</h2>
              <h2>잘 가, 나의 가족</h2>
              <button
                onClick={() => navigate("/record")}
                className="record-button"
              >
                반려 가족 정보 기록하기
              </button>
            </div>
            <div className="dog-image">
              <img src="/golden-retriever.png" alt="골든 리트리버" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
