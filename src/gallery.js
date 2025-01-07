import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./commom.css";
import "./gallery.css";
import ProfileTab from "./ProfileTab";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileTab, setShowProfileTab] = useState(false);
  const location = useLocation();

  // 사용자 정보 불러오기
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
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/board", {
        withCredentials: true,
      });
      setPhotos(response.data);
    } catch (error) {
      console.error("사진 불러오기 실패:", error);
    }
  };

  const handlePhotoClick = (photoId) => {
    navigate(`/photo/${photoId}`);
  };

  return (
    <div className="gallery-container">
      <div className="navbar">
        <div className="logo" onClick={() => navigate("/dashboard")}>
          Re:PET
        </div>
        <div className="nav-links">
          <span
            className={location.pathname === "/record" ? "active" : ""}
            onClick={() => navigate("/record")}
          >
            기록하기
          </span>
          <span
            className={location.pathname === "/remember" ? "active" : ""}
            onClick={() => navigate("/remember")}
          >
            추억하기
          </span>
          <span
            className={location.pathname === "/chat" ? "active" : ""}
            onClick={() => navigate("/chat")}
          >
            대화하기
          </span>
        </div>
        <div className="profile">
          <img
            src={user?.picture || "/default-profile.png"}
            alt="User"
            className="profile-pic"
            onClick={() => setShowProfileTab(!showProfileTab)}
          />
          {showProfileTab && (
            <ProfileTab user={user} onClose={() => setShowProfileTab(false)} />
          )}
        </div>
      </div>

      <div className="content">
        <div className="left-section">
          <h2>~~이와의 추억</h2>
          <button
            onClick={() => navigate("/photo/upload")}
            className="upload-button"
          >
            업로드하기
          </button>
        </div>

        <div className="right-section">
          <div className="photo-grid">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="photo-item"
                onClick={() => handlePhotoClick(photo.id)}
              >
                <img
                  src={
                    photo.imageFileName
                      ? `http://localhost:8080${photo.imageFileName}`
                      : "default-image.png"
                  }
                  alt={photo.title}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
