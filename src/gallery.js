import React, { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Gallery = () => {
 const [photos, setPhotos] = useState([]);
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
             className="w-10 h-10 rounded-full border-2 border-yellow-200 hover:border-yellow-400 transition-colors"
           />
         </div>
       </div>
     </nav>

     {/* Main Content */}
     <div className="max-w-7xl mx-auto px-6 py-8">
       <div className="flex flex-col lg:flex-row gap-8">
         {/* Left Section */}
         <div className="lg:w-1/4">
           <div className="bg-white rounded-2xl shadow-lg p-6">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">~~이와의 추억</h2>
             <button
               onClick={() => navigate("/photo/upload")}
               className="w-full px-6 py-3 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 transition-colors shadow-md"
             >
               업로드하기
             </button>
           </div>
         </div>

         {/* Right Section - Photo Grid */}
         <div className="lg:w-3/4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {photos.map((photo) => (
               <div
                 key={photo.id}
                 onClick={() => handlePhotoClick(photo.id)}
                 className="cursor-pointer group"
               >
                 <div className="aspect-square overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:scale-105">
                   <img
                     src={
                       photo.imageFileName
                         ? `http://localhost:8080${photo.imageFileName}`
                         : "default-image.png"
                     }
                     alt={photo.title}
                     className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                   />
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Gallery;