import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileTab from "./ProfileTab";
import pawImage from "./assets/images/paw.jpg"; // 이미지 import 추가

const MasonryGallery = ({ photos, onPhotoClick }) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {photos.map((photo) => (
        <div
          key={photo.id}
          onClick={() => onPhotoClick(photo.id)}
          className="break-inside-avoid-column cursor-pointer transform transition-all duration-300 hover:scale-[1.02] mb-6"
        >
          <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
            <img
              src={
                photo.imageFileName
                  ? `http://localhost:8080${photo.imageFileName}`
                  : "default-image.png"
              }
              alt={photo.title}
              className="w-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileTab, setShowProfileTab] = useState(false);

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

      {/* Main Content with full height calculation */}
      <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-4rem)]">
        <div className="flex gap-8 h-full py-8">
          {/* Left Section - Fixed Width */}
          <div className="w-76 flex-shrink-0 h-full">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 h-full flex flex-col justify-center">
              <div>
                <img
                  src={pawImage}
                  alt="photo album"
                  className="w-40 h-40 mx-auto mb-6 object-cover rounded-full"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  "우리 그 때 기억나?"
                </h2>
                <p className="text-gray-600 text-center mb-8 text-sm leading-relaxed">
                  반려 가족과의 추억을 올리고 모아보세요.
                </p>
                <button
                  onClick={() => navigate("/photo/upload")}
                  className="w-full px-6 py-3 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 transition-colors shadow-md"
                >
                  사진 업로드하기
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Masonry Gallery */}
          <div className="flex-1 overflow-y-auto">
            <MasonryGallery photos={photos} onPhotoClick={handlePhotoClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
