import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import { useSelector } from "react-redux";

import Header from './components/Header';

import { backgroundColorTheme, textColorTheme } from './utils/themeUtil.js'

const App = () => {
  const location = useLocation();

  const [height, setHeight] = useState(0);
  const [isAuthPage, setIsAuthPage] = useState(true);

  const { themeMode } = useSelector((state) => state.theme);

  useEffect(() => {
    setHeight(window.innerHeight);

    setIsAuthPage(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname.startsWith('/activate'));
  }, [location.pathname]);

  return (
    <>
      <main className={`${backgroundColorTheme[themeMode]} ${textColorTheme[themeMode]}`} style={{ height: height }}>
        {!isAuthPage && <Header />}
        <div style={{ height: isAuthPage ? height : height - 56, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          < Outlet />
        </div>
      </main>
      <ToastContainer position="top-center" transition={Slide} hideProgressBar autoClose={1500} />
    </>
  )
};

export default App;