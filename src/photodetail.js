import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./commom.css";
import "./photodetail.css";
import ProfileTab from "./ProfileTab";

const PhotoDetail = () => {
  const [photo, setPhoto] = useState(null);
  const { id } = useParams();
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
    fetchPhotoDetail();
  }, [id]);

  const fetchPhotoDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/board/${id}`, {
        withCredentials: true,
      });
      setPhoto(response.data);
    } catch (error) {
      console.error("사진 상세 정보 불러오기 실패:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/board/${id}`, {
        withCredentials: true,
      });
      navigate("/remember");
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  if (!photo) return null;

  return (
    <div className="detail-container">
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

      <div className="detail-content">
        <div className="photo-content">
          <img
            src={
              photo.imageFileName
                ? `http://localhost:8080${photo.imageFileName}`
                : "default-image.png"
            }
            alt={photo.title}
          />
          <h3>{photo.title}</h3>
          <p>{photo.content}</p>
        </div>

        <div className="button-group">
          <button onClick={() => navigate(`/remember`)} className="edit-button">
            이전으로
          </button>
          <button onClick={handleDelete} className="delete-button">
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
