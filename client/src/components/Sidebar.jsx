import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { GraduationCap, Home, ScrollText, User } from "lucide-react";

import { backgroundColorTheme, navbarItemHoverColor, contentBackgroundColor } from "../utils/themeUtil";

const sidebarElements = [
    {
        icon: <Home size={22} />,
        text: "Home",
        to: "/home"
    },
    {
        icon: <ScrollText size={22} />,
        text: "Upload Resume",
        to: "/upload"
    },
    {
        icon: <GraduationCap size={22} />,
        text: "Practice",
        to: "/practice"
    },
];

export default function Sidebar() {
    const [openUserMenu, setOpenUserMenu] = useState(false);

    const { themeMode } = useSelector((state) => state.theme);
    const { userInfo } = useSelector((state) => state.auth);

    return (
        <div className={`flex flex-col w-full h-full justify-between ${backgroundColorTheme[themeMode]} pl-1`}>
            <div className="flex flex-col my-6 h-full overflow-y-auto">
                {sidebarElements.map((element, idx) => (
                    <Link key={idx} to={element.to} className={`flex flex-row gap-2 pl-3 py-3 justify-self-start rounded-lg ${navbarItemHoverColor[themeMode]} `}>
                        {element.icon}
                        <p>{element.text}</p>
                    </Link>
                ))}
                {/* <div className="flex flex-row gap-2 justify-self-start">
                    <Home size={22} />
                    <p>Home</p>
                </div>
                <div className="flex flex-row gap-2 justify-self-start">
                    <Home size={22} />
                    <p>Home</p>
                </div>
                <div className="flex flex-row gap-2 justify-self-start">
                    <Home size={22} />
                    <p>Home</p>
                </div>
                <div className="flex flex-row gap-2 justify-self-start">
                    <Home size={22} />
                    <p>Home</p>
                </div> */}
            </div>

            {/* Bottom section */}
            <div className={`relative py-3 mb-1 pl-3 flex w-full cursor-pointer select-none ${navbarItemHoverColor[themeMode]} rounded-lg`} onClick={() => setOpenUserMenu(!openUserMenu)}>
                <div className={`flex flex-row gap-2`}>
                    <User size={22} />
                    <p>{userInfo?.email.split('@')[0]}</p>
                </div>

                {/* Popup Menu */}
                {openUserMenu && (
                    <div className={`absolute bottom-14 left-26 -translate-x-1/2 ${contentBackgroundColor[themeMode]} rounded-lg shadow-lg py-2 w-48 z-10`}>
                        <Link to={"/account"} className={`block w-full text-left px-4 py-2 cursor-pointer ${navbarItemHoverColor[themeMode]}`}> Account </Link>

                        <Link to={"/profile"} className={`block w-full text-left px-4 py-2 cursor-pointer ${navbarItemHoverColor[themeMode]}`}> Profile </Link>

                        {/* <button className={`block w-full text-left px-4 py-2 cursor-pointer ${navbarItemHoverColor[themeMode]}`}>Settings</button> */}

                        <button className={`block w-full text-left px-4 py-2 text-red-400 cursor-pointer ${navbarItemHoverColor[themeMode]}`}> Logout </button>
                    </div>
                )}
            </div>
        </div>
    );
}
