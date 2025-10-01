import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";

import { useDeleteUserAccountMutation } from "../redux/slices/async/usersApiSlice";

import { contentBackgroundColor, sectionTitleTheme, textInputBorderColorTheme, textInputBorderColorFocusedTheme, textInputBackgroundColorTheme, buttonTextColorTheme, buttonColorTheme, buttonColorHoveredTheme, buttonColorFocusedTheme, toastBackgroundTheme, toastTextTheme, textColorTheme } from "../utils/themeUtil";

const DeleteAccountPage = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const [isPasswordFilled, setIsPasswordFilled] = useState(false);

    const { themeMode } = useSelector((state) => state.theme);
    const { accessToken } = useSelector((state) => state.accessToken);

    const [deleteUserAccount, { isLoading: deleteUserAccountLoading }] = useDeleteUserAccountMutation();

    const deleteAccount = async () => {
        if (password.length === 0) {
            toast.error("");
        }

        try {
            const res = await deleteUserAccount({ password, accessToken }).unwrap();

            if (res === null) {
                toast.success("Account deleted successfully",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                navigate('/login');
            }
            else {
                toast.error("Error deleting account, Please try again",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
            }
        } catch (err) {
            console.log(err);
            toast.error("error",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            );
        }
    };

    return (
        <>
            <div className="flex h-full w-full">
                <div className="basis-1/5 min-w-48">
                    <Sidebar />
                </div>
                <div className="flex flex-col w-full justify-center items-center">
                    {
                        !isPasswordFilled &&
                        <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
                            <div className="flex flex-col items-center px-6">
                                <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]} select-none`}>Delete Account</p>
                            </div>

                            <div className="p-6 w-full max-w-sm">
                                <div className="mb-4">
                                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none border-none textInputBorderColorTheme[themeMode] ${textInputBackgroundColorTheme[themeMode]}`} placeholder="Enter password" required />
                                </div>

                                <button onClick={() => setIsPasswordFilled(true)} className={`w-full ${buttonTextColorTheme[themeMode]} py-2 rounded-lg focus:outline-none bg-red-600 hover:bg-red-500 flex justify-center items-center`}> Delete Account </button>
                            </div>
                        </div>
                    }

                    {
                        isPasswordFilled &&
                        <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
                            <div className="flex flex-col items-center px-6">
                                <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]}`}>Are you sure?</p>
                            </div>

                            <div className="p-6 w-full max-w-sm flex gap-2">
                                <button disabled={deleteUserAccountLoading} onClick={deleteAccount} className={`w-full ${buttonTextColorTheme[themeMode]} py-2 rounded-lg focus:outline-none bg-red-600 hover:bg-red-500 flex justify-center items-center`}> {deleteUserAccountLoading ? <ClipLoader size={24} color={textColorTheme[themeMode]} /> : "Delete"} </button>
                                <button disabled={deleteUserAccountLoading} onClick={() => navigate('/account')} className={`w-full ${buttonTextColorTheme[themeMode]} ${buttonColorTheme[themeMode]} py-2 rounded-lg ${buttonColorHoveredTheme[themeMode]} focus:outline-none ${buttonColorFocusedTheme[themeMode]} flex justify-center items-center`}> Go back </button>
                            </div>
                        </div>
                    }
                </div>
            </div >
        </>
    )
}

export default DeleteAccountPage;