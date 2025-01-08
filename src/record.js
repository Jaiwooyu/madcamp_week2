import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ProfileTab from "./ProfileTab";
import previmg from "./assets/images/image_preview.png";

const Record = () => {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    birthDate: "",
    gender: "",
    species: "",
    personality: "",
    traits: "",
    happyMemory: "",
    mishap: "",
    strengths: "",
    weaknesses: "",
  });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
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

  const handleInputChange = (e, field) => {
    const value = e.target.value;

    // 출생일 입력을 yyyy.mm.dd 형식으로 자동 포맷
    if (field === "birthDate") {
      // 숫자 외 문자는 입력되지 않도록 처리
      const formattedValue = value.replace(/[^0-9.]/g, "");
      // 날짜 포맷 맞추기 (yyyy.mm.dd 형식)
      const datePattern = /(\d{4})(\d{2})(\d{2})/;
      const formattedDate = formattedValue.replace(datePattern, "$1.$2.$3");
      setFormData({ ...formData, birthDate: formattedDate });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.image) newErrors.image = "사진을 업로드해주세요.";
      ["name", "birthDate", "species", "gender"].forEach((field) => {
        if (!formData[field]) newErrors[field] = "필수 입력입니다.";
      });
    } else if (currentStep === 1) {
      ["personality", "traits"].forEach((field) => {
        if (!formData[field]) newErrors[field] = "필수 입력입니다.";
      });
    } else if (currentStep === 2) {
      ["happyMemory", "mishap"].forEach((field) => {
        if (!formData[field]) newErrors[field] = "필수 입력입니다.";
      });
    }
    if (currentStep === 3) {
      ["strengths", "weaknesses"].forEach((field) => {
        if (!formData[field]) newErrors[field] = "필수 입력입니다.";
      });
    }
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
    Object.keys(formData).forEach((key) => {
      submitForm.append(key, formData[key]);
    });

    axios
      .post("http://localhost:8080/api/pets", submitForm, {
        headers: { "Content-Type": "multipart/form-data" },
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className="text-2xl font-bold text-black-400 cursor-pointer hover:text-black-500 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Re:PET
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("/record")}
              className="text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              기록하기
            </button>
            <button
              onClick={() => navigate("/remember")}
              className="text-gray-600 hover:text-yellow-400 transition-colors"
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-gray-800 text-center mb-2">
          반려 가족 기억하기
        </h1>
        <h2 className="text-xl text-gray-800 text-center mb-8">
          떠나간 내 가족의 이야기를 들려주세요.
        </h2>

        {/* Step Progress Bar */}
        <div className="flex justify-between mb-8">
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-1/4 h-2 ${
                step <= currentStep ? "bg-yellow-400" : "bg-gray-200"
              } ${step === 0 ? "rounded-l-full" : ""} ${
                step === 3 ? "rounded-r-full" : ""
              }`}
            />
          ))}
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentStep === 0 && (
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column: Image Upload */}
              <div className="space-y-1">
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
                <div className="relative w-full h-60 p-3">
                  {formData.image ? (
                    <img
                      src={formData.image}
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
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
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
              <div className="space-y-7">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="이름"
                    value={formData.name}
                    onChange={(e) => handleInputChange(e, "name")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="출생 (yyyy.mm.dd)"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange(e, "birthDate")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.birthDate}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="종 (ex. 강아지, 도마뱀)"
                    value={formData.species}
                    onChange={(e) => handleInputChange(e, "species")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.species && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.species}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="성별"
                    value={formData.gender}
                    onChange={(e) => handleInputChange(e, "gender")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <textarea
                  placeholder="성격은 어땠나요?"
                  value={formData.personality}
                  onChange={(e) => handleInputChange(e, "personality")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-32"
                />
                {errors.personality && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.personality}
                  </p>
                )}
              </div>
              <div>
                <div>
                  <textarea
                    placeholder="특징이 있다면?"
                    value={formData.traits}
                    onChange={(e) => handleInputChange(e, "traits")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-32"
                  />
                  {errors.traits && (
                    <p className="text-red-500 text-sm mt-1">{errors.traits}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <textarea
                  placeholder="행복했던 기억이 있나요?"
                  value={formData.happyMemory}
                  onChange={(e) => handleInputChange(e, "happyMemory")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-32"
                />
                {errors.happyMemory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.happyMemory}
                  </p>
                )}
              </div>
              <div>
                <textarea
                  placeholder="사고쳤던 적이 있나요?"
                  value={formData.mishap}
                  onChange={(e) => handleInputChange(e, "mishap")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-32"
                />
                {errors.mishap && (
                  <p className="text-red-500 text-sm mt-1">{errors.mishap}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <textarea
                  placeholder="장점은 무엇인가요?"
                  value={formData.strengths}
                  onChange={(e) => handleInputChange(e, "strengths")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-32"
                />
                {errors.strengths && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.strengths}
                  </p>
                )}
              </div>
              <div>
                <textarea
                  placeholder="단점은 무엇인가요?"
                  value={formData.weaknesses}
                  onChange={(e) => handleInputChange(e, "weaknesses")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-32"
                />
                {errors.weaknesses && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.weaknesses}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            >
              이전으로
            </button>
          )}
          <button
            onClick={handleNext}
            className={`px-6 py-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors ${
              currentStep === 0 ? "ml-auto" : ""
            }`}
          >
            {currentStep === 3 ? "완료하기" : "다음으로"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Record;
