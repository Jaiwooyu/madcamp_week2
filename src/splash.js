import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./commom.css";
import "./splash.css";
import axios from "axios";

const Splash = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
