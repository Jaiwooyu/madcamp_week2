import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './homepage';
import Dashboard from './dashboard';
import Record from './record';
import Chat from './chat';
import Gallery from './gallery';
import PhotoUpload from './photoupload';
import PhotoDetail from './photodetail';

const App = () => {
 return (
   <Router>
     <Routes>
       <Route path="/" element={<Homepage />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/record" element={<Record />} />
       <Route path="/chat" element={<Chat />} />
       <Route path="/remember" element={<Gallery />} />
       <Route path="/photo/upload" element={<PhotoUpload />} />
       <Route path="/photo/:id" element={<PhotoDetail />} />
     </Routes>
   </Router>
 );
};

export default App;