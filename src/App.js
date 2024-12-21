import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoNavLayout from './components/Layout/NoNavLayout';
import DefaultLayout from './components/Layout/DefaultLayout';

import LoginPage from './components/Login/Login';
import RegisterPage from './components/Register/Register';
import Home from './components/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NoNavLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
