// NoNavLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';

function NoNavLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default NoNavLayout;
