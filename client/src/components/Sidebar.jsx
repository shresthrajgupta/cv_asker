import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GraduationCap, Home, ScrollText, User } from "lucide-react";

import { navbarItemHoverColor, contentBackgroundColor, sidebarBackgroundColor, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

import { setSidebarOpen } from "../redux/slices/sync/sidebarOpenSlice";
import { useLogoutMutation } from "../redux/slices/async/usersApiSlice";

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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [openUserMenu, setOpenUserMenu] = useState(false);

    const { themeMode } = useSelector((state) => state.theme);
    const { userInfo } = useSelector((state) => state.auth);
    const { sidebarOpen } = useSelector((state) => state.sidebarOpen);
    const { accessToken } = useSelector((state) => state.accessToken);

    const [logout, { isLoading: logoutLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            const res = await logout(accessToken);

            if (res?.data?.message === "Logged out successfully") {
                navigate('/login');
                window.location.reload();
            }
            else {
                toast.error("Enter valid email", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={`fixed md:relative top-0 left-0 h-full w-4/5 md:w-auto md:basis-1/5 transition-transform duration-300 ease-in-out  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{ zIndex: 50 }} >
            <div className={`flex flex-col w-full min-w-48 min-h-full justify-between ${sidebarBackgroundColor[themeMode]} pl-1`}>
                <div className="flex flex-col my-6 h-full overflow-y-auto">
                    {sidebarElements.map((element, idx) => (
                        <div key={idx} onClick={() => dispatch(setSidebarOpen(false))}>
                            <Link to={element.to} className={`flex flex-row gap-2 pl-3 py-3 justify-self-start rounded-lg ${navbarItemHoverColor[themeMode]}`}>
                                {element.icon}
                                <p> {element.text} </p>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Bottom section */}
                <div className={`relative py-3 mb-1 pl-3 flex w-full cursor-pointer select-none ${navbarItemHoverColor[themeMode]} rounded-lg`} onClick={() => setOpenUserMenu(!openUserMenu)}>
                    <div className={`flex flex-row gap-2`}>
                        <User size={22} />
                        <p>{userInfo?.email.split('@')[0]}</p>
                    </div>

                    {/* Popup Menu */}
                    {openUserMenu && (
                        <div onClick={() => dispatch(setSidebarOpen(false))} className={`absolute bottom-14 left-26 -translate-x-1/2 ${contentBackgroundColor[themeMode]} rounded-lg shadow-lg py-2 w-48 z-10`}>
                            <Link to={"/account"} className={`block w-full text-left px-4 py-2 cursor-pointer ${navbarItemHoverColor[themeMode]}`}> Account </Link>

                            <Link to={"/profile"} className={`block w-full text-left px-4 py-2 cursor-pointer ${navbarItemHoverColor[themeMode]}`}> Profile </Link>

                            <button onClick={handleLogout} className={`block w-full text-left px-4 py-2 text-red-400 cursor-pointer ${navbarItemHoverColor[themeMode]}`}> Logout </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
