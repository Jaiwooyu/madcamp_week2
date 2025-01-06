import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './dashboard.css'; // CSS 파일 추가

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", {withCredentials: true} )
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        navigate("/"); // 로그인되지 않은 경우 홈으로 리디렉트
      });
  }, [navigate]);

  if (!user) {
    return null; // 리디렉트되기 때문에 렌더링할 내용 없음
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <div className="logo">Re:PET</div>
        <div className="nav-links">
          <span onClick={() => handleNavigation('/record')}>기록하기</span>
          <span onClick={() => handleNavigation('/remember')}>추억하기</span>
          <span onClick={() => handleNavigation('/chat')}>대화하기</span>
          <span>이용 가이드</span>
        </div>
        <div className="profile">
          <img src={user.picture || 'default-profile.png'} alt="User" className="profile-pic" />
        </div>
      </div>

      <div className="content">
        <h1>대시보드</h1>
        <p>환영합니다, {user.name}님!</p>
      </div>
    </div>
  );
};

export default Dashboard;