import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./commom.css";
import "./record.css";
import axios from "axios";
import ProfileTab from "./ProfileTab";

const Record = () => {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    birthDate: "", // birth -> birthDate로 변경
    gender: "",
    species: "",
    personality: "", // 새로 추가
    traits: "", // 새로 추가
    happyMemory: "", // 새로 추가
    mishap: "", // 새로 추가
    strengths: "", // 새로 추가
    weaknesses: "", // 새로 추가
  });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const [showProfileTab, setShowProfileTab] = useState(false);
  const location = useLocation();

  const [user, setUser] = useState(null);
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

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.image) newErrors.image = "사진을 업로드해주세요.";
      ["name", "birthDate", "species", "gender"].forEach((field) => {
        if (!formData[field]) newErrors[field] = "필수 입력입니다.";
      });
    }
    // 다른 단계는 선택적 입력이므로 유효성 검사 제외

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        submitData();
        navigate("/splash");
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const submitData = () => {
    const submitForm = new FormData();

    submitForm.append("image", formData.image);
    submitForm.append("name", formData.name);
    submitForm.append("birthDate", formData.birthDate);
    submitForm.append("gender", formData.gender);
    submitForm.append("species", formData.species);
    submitForm.append("personality", formData.personality);
    submitForm.append("traits", formData.traits);
    submitForm.append("happyMemory", formData.happyMemory);
    submitForm.append("mishap", formData.mishap);
    submitForm.append("strengths", formData.strengths);
    submitForm.append("weaknesses", formData.weaknesses);

    axios
      .post("http://localhost:8080/api/pets", submitForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("데이터 전송 중 오류 발생:", error);
      });
  };

  return (
    <div className="dashboard">
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

      <div className="record-container">
        <h1 className="record-title">반려 가족 기억하기</h1>
        {currentStep === 0 && (
          <div className="record-form">
            <input
              type="text"
              placeholder="이름"
              value={formData.name}
              onChange={(e) => handleInputChange(e, "name")}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}

            <input
              type="text"
              placeholder="출생 (yyyy.mm.dd)"
              value={formData.birthDate}
              onChange={(e) => handleInputChange(e, "birthDate")}
            />
            {errors.birthDate && (
              <div className="error-message">{errors.birthDate}</div>
            )}

            <input
              type="text"
              placeholder="종"
              value={formData.species}
              onChange={(e) => handleInputChange(e, "species")}
            />
            {errors.species && (
              <div className="error-message">{errors.species}</div>
            )}

            <input
              type="text"
              placeholder="성별"
              value={formData.gender}
              onChange={(e) => handleInputChange(e, "gender")}
            />
            {errors.gender && (
              <div className="error-message">{errors.gender}</div>
            )}

            <input type="file" onChange={handleFileChange} />
            {errors.image && (
              <div className="error-message">{errors.image}</div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="record-form">
            <textarea
              placeholder="성격"
              value={formData.personality}
              onChange={(e) => handleInputChange(e, "personality")}
            />
            <textarea
              placeholder="특징"
              value={formData.traits}
              onChange={(e) => handleInputChange(e, "traits")}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="record-form">
            <textarea
              placeholder="행복했던 기억"
              value={formData.happyMemory}
              onChange={(e) => handleInputChange(e, "happyMemory")}
            />
            <textarea
              placeholder="사고뭉치 에피소드"
              value={formData.mishap}
              onChange={(e) => handleInputChange(e, "mishap")}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="record-form">
            <textarea
              placeholder="장점"
              value={formData.strengths}
              onChange={(e) => handleInputChange(e, "strengths")}
            />
            <textarea
              placeholder="단점"
              value={formData.weaknesses}
              onChange={(e) => handleInputChange(e, "weaknesses")}
            />
          </div>
        )}

        <div className="button-group">
          {currentStep > 0 && (
            <button onClick={handlePrev} className="prev-button">
              이전으로
            </button>
          )}
          <button onClick={handleNext} className="next-button">
            {currentStep === 3 ? "완료하기" : "다음으로"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Record;
