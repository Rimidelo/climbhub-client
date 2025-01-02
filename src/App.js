import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoNavLayout from './components/Layout/NoNavLayout';
import DefaultLayout from './components/Layout/DefaultLayout';
import { UserProvider } from './contexts/UserContext';
import LoginPage from './components/Login/Login';
import RegisterPage from './components/Register/Register';
import VideoUploder from './components/UploadVideo/UploadVideo';
import VideoReels from './components/VideoReels/VideoReels';
import Preferences from './components/Preferences/Preferences';
import Feed from './components/Feed/Feed';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute

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
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/video-upload"
              element={
                <ProtectedRoute>
                  <VideoUploder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reels"
              element={
                <ProtectedRoute>
                  <VideoReels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
