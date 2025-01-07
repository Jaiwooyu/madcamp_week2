import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PhotoDetail = () => {
 const [photo, setPhoto] = useState(null);
 const { id } = useParams();
 const navigate = useNavigate();
 const [user, setUser] = useState(null);

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
   <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-gray-50">
     {/* Navbar */}
     <nav className="bg-white shadow-md px-6 py-4">
       <div className="max-w-7xl mx-auto flex items-center justify-between">
         <div 
           className="text-2xl font-bold text-yellow-400 cursor-pointer hover:text-yellow-500 transition-colors"
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
             className="w-10 h-10 rounded-full border-2 border-yellow-200 hover:border-yellow-400 transition-colors"
           />
         </div>
       </div>
     </nav>

     {/* Main Content */}
     <div className="max-w-4xl mx-auto px-4 py-8">
       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
         {/* Photo Section */}
         <div className="aspect-video relative">
           <img
             src={
               photo.imageFileName
                 ? `http://localhost:8080${photo.imageFileName}`
                 : "default-image.png"
             }
             alt={photo.title}
             className="w-full h-full object-cover"
           />
         </div>

         {/* Content Section */}
         <div className="p-6">
           <h3 className="text-2xl font-bold text-gray-800 mb-4">
             {photo.title}
           </h3>
           <p className="text-gray-600 text-lg leading-relaxed mb-8">
             {photo.content}
           </p>

           {/* Buttons */}
           <div className="flex justify-between items-center">
             <button
               onClick={() => navigate(`/remember`)}
               className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
             >
               이전으로
             </button>
             <button
               onClick={handleDelete}
               className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
             >
               삭제하기
             </button>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default PhotoDetail;