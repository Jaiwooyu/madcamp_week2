import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileTab = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <>
      <div className="profile-tab-overlay" onClick={onClose} />
      <div className="profile-tab">
        <div className="profile-tab-header">
          <img
            src={user?.picture || "/default-profile.png"}
            alt="Profile"
            className="profile-tab-pic"
          />
          <div className="profile-tab-info">
            <div className="profile-tab-name">{user?.name || "사용자"}</div>
            <div className="profile-tab-email">
              {user?.email || "email@example.com"}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="profile-tab-logout">
          로그아웃
        </button>
      </div>
    </>
  );
};

export default ProfileTab;
