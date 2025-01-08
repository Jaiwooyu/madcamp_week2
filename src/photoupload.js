import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./commom.css";
import "./photoupload.css";
import ProfileTab from "./ProfileTab";
import previmg from "./assets/images/image_preview.png";

const PhotoUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    imagePreview: null,
  });
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileTab, setShowProfileTab] = useState(false);
  const location = useLocation();

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
              className="text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              추억하기
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="text-gray-600 hover:text-yellow-400 transition-colors"
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-gray-800 text-center mb-2">
          반려 가족 추억하기
        </h1>
        <h2 className="text-lg text-gray-800 text-center mb-8">
          떠나간 내 가족과의 순간으로 사진으로 추억해보아요
        </h2>

        <div className="upload-form bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column: Image Upload */}
            <div className="space-y-4">
              <div className="relative w-full h-48 p-2">
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <img src={previmg} alt="Default Icon" className="w-32" />
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
              <div className="flex justify-center items-center">
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                  onClick={() =>
                    document.querySelector('input[type="file"]').click()
                  }
                >
                  사진 업로드
                </button>
              </div>
            </div>

            {/* Right Column: Text Inputs */}
            <div className="space-y-4 mt-2">
              <input
                type="text"
                name="title"
                placeholder="제목"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <textarea
                name="content"
                placeholder="사진에는 어떤 추억이 담겨 있나요?"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-32"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
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
