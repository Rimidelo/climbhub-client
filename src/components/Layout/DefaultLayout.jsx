// DefaultLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

function DefaultLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default DefaultLayout;
