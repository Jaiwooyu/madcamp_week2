import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./commom.css";
import "./photoupload.css";
import ProfileTab from "./ProfileTab";

const PhotoUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async () => {
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("content", formData.content);
    submitData.append("imageFile", formData.image);

    try {
      const response = await axios.post(
        "http://localhost:8080/board",
        submitData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate(`/photo/${response.data.id}`);
    } catch (error) {
      console.error("업로드 실패:", error);
    }
  };

  return (
    <div className="upload-container">
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
        <div className="relative">
          <img
            src={user?.picture || "/default-profile.png"}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-yellow-200 hover:border-yellow-400 transition-colors cursor-pointer"
            onClick={() => setShowProfileTab(!showProfileTab)}
          />
          {showProfileTab && (
            <ProfileTab user={user} onClose={() => setShowProfileTab(false)} />
          )}
        </div>
      </div>

      <div className="upload-content">
        <h2>반려 가족 추억하기</h2>
        <p>떠나간 내 가족과의 순간으로 사진으로 추억해보아요</p>

        <div className="upload-form">
          <div className="image-upload">
            <input type="file" onChange={handleFileChange} accept="image/*" />
          </div>
          <input
            type="text"
            name="title"
            placeholder="제목"
            value={formData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="content"
            placeholder="사진에는 어떤 추억이 담겨 있나요?"
            value={formData.content}
            onChange={handleInputChange}
          />
        </div>

        <div className="button-group">
          <button onClick={() => navigate("/remember")} className="back-button">
            이전으로
          </button>
          <button onClick={handleSubmit} className="submit-button">
            완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
