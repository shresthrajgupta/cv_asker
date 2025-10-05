import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Sun, Moon, Menu } from "lucide-react";

import logo from "../assets/logo.svg";

import { setTheme } from "../redux/slices/sync/themeSlice.js";

import { navbarBackgroundColor } from "../utils/themeUtil.js";
import { setSidebarOpen } from "../redux/slices/sync/sidebarOpenSlice.js";

const Header = () => {
  const dispatch = useDispatch();

  const { themeMode } = useSelector((state) => state.theme);
  const { sidebarOpen } = useSelector((state) => state.sidebarOpen);

  const toggleTheme = () => {
    if (themeMode === 'dark') {
      dispatch(setTheme('light'));
    }
    else {
      dispatch(setTheme('dark'));
    }
  };

  return (
    <div className={`flex h-[56px] ${navbarBackgroundColor[themeMode]} justify-between md:justify-start`}>
      {
        window.innerWidth < 768 &&
        <div className="flex justify-start items-center p-2 w-23">
          <button onClick={() => dispatch(setSidebarOpen(!sidebarOpen))} className="hover:opacity-20">
            <Menu />
          </button>
        </div>
      }

      <Link to="/home" className="flex flex-row h-full md:w-1/5 md:min-w-48">
        <div className="h-full flex justify-center items-center px-2">
          <img src={logo} alt='Logo' className="w-12" />
          <p>CV Asker</p>
        </div>
      </Link>

      <div className="flex h-full md:w-full items-center gap-3 pr-2 md:pr-20 justify-end">
        <span className="text-sm"> <Sun color={(themeMode === "light") ? "#65686c" : "#e2e5e9"} size={24} /> </span>

        <button onClick={toggleTheme} className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${(themeMode === "dark") ? "bg-gray-600" : "bg-gray-300"}`} >
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${(themeMode === "dark") ? "translate-x-6" : ""}`}></div>
        </button>

        <span className="text-sm"><Moon color={(themeMode === "light") ? "#65686c" : "#e2e5e9"} size={24} /></span>
      </div>
    </div >
  );
};

export default Header;