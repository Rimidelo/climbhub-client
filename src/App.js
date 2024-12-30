import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoNavLayout from './components/Layout/NoNavLayout';
import DefaultLayout from './components/Layout/DefaultLayout';
import { UserProvider } from './contexts/UserContext';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Register/Register';
// import Home from './components/Home/Home';
import VideoUploder from './components/UploadVideo/UploadVideo'
import VideoReels from './components/VideoReels/VideoReels'
import Preferences from './components/Preferences/Preferences'
import Feed from './components/Feed/Feed';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<NoNavLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Feed />} />
            <Route path="/video-uplode" element={<VideoUploder />} />
            <Route path="/reels" element={<VideoReels />} />
            <Route path="/preferences" element={<Preferences />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
