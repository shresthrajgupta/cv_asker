import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import MainContainer from "../components/MainContainer";
import Overlay from "../components/Overlay";
import ContentContainer from "../components/ContentContainer";
import GreenButton from "../components/GreenButton";
import Loading from "../components/Loading";

import { useDeleteUserAccountMutation } from "../redux/slices/async/usersApiSlice";

import { contentBackgroundColor, sectionTitleTheme, textInputBackgroundColorTheme, buttonTextColorTheme, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

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
        <MainContainer>
            <Sidebar />

            <Overlay />

            <ContentContainer>
                {
                    !isPasswordFilled &&
                    <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
                        <div className="flex flex-col items-center px-6">
                            <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]} select-none`}>Delete Account</p>
                        </div>

                        <div className="p-6 w-full max-w-sm">
                            <div className="mb-4">
                                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-3 py-2 border rounded focus:outline-none border-none textInputBorderColorTheme[themeMode] ${textInputBackgroundColorTheme[themeMode]}`} placeholder="Enter password" required />
                            </div>

                            <button onClick={() => setIsPasswordFilled(true)} className={`w-full ${buttonTextColorTheme[themeMode]} py-2 rounded focus:outline-none bg-red-600 hover:bg-red-500 flex justify-center items-center`}> Delete Account </button>
                        </div>
                    </div>
                }

                {
                    isPasswordFilled &&
                    <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
                        <div className="flex flex-col items-center px-6">
                            <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]}`}>Are you sure?</p>
                        </div>

                        <div className="p-6 w-full md:max-w-sm flex flex-col md:flex-row gap-2">
                            <GreenButton text={deleteUserAccountLoading ? <Loading /> : "Delete"} disabled={deleteUserAccountLoading} onclick={deleteAccount} additionalClasses="w-full bg-red-600 hover:bg-red-500" />

                            <GreenButton text="Go back" disabled={deleteUserAccountLoading} onclick={() => navigate('/account')} additionalClasses="w-full" />
                        </div>
                    </div>
                }
            </ContentContainer>
        </MainContainer >
    )
}

export default DeleteAccountPage;