import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./commom.css";
import "./photoupload.css";
import ProfileTab from "./ProfileTab";
import previmg from "./assets/images/image_preview.png"; // 기본 이미지 import 추가

const PhotoUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    imagePreview: null, // 이미지 프리뷰를 위한 state 추가
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
        setUser(response.data);
      })
      .catch(() => {
        navigate("/");
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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
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
          className="text-2xl font-bold text-gray-600 cursor-pointer hover:text-black-500 transition-colors"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer", color: "black" }}
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
      <h1 className="text-3xl text-gray-800 text-center mb-2">
          반려 가족 추억하기
        </h1>
        <h2 className="text-xl text-gray-800 text-center mb-8">
          떠나간 내 가족과의 순간으로 사진으로 추억해보아요
        </h2>

        <div className="upload-form">
          {/* 이미지 업로드 영역 수정 */}
          <div className="relative w-full h-60 p-3 mb-4">
            {formData.imagePreview ? (
              <img
                src={formData.imagePreview}
                alt="Uploaded Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <img src={previmg} alt="Default Icon" className="w-40" />
              </div>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
          {/* 파일 선택 버튼 */}
          <div className="flex justify-center items-center mb-4">
            <button
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
              onClick={() => document.querySelector('input[type="file"]').click()}
            >
              사진 업로드
            </button>
          </div>

          <input
            type="text"
            name="title"
            placeholder="제목"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
          />
          <textarea
            name="content"
            placeholder="사진에는 어떤 추억이 담겨 있나요?"
            value={formData.content}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-32"
          />
        </div>

        <div className="button-group mt-8">
          <button
            onClick={() => navigate("/remember")}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          >
            이전으로
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors"
          >
            완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;