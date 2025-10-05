import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import MainContainer from "../components/MainContainer";
import Overlay from "../components/Overlay";
import ContentContainer from "../components/ContentContainer";
import GreenButton from "../components/GreenButton";

import { useUpdateUserAccountInfoMutation } from "../redux/slices/async/usersApiSlice";

import { contentBackgroundColor, textInputBackgroundColorTheme, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

export default function AccountPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [activate, setActivate] = useState("");

    const { themeMode } = useSelector((state) => state.theme);
    const { userInfo } = useSelector((state) => state.auth);
    const { accessToken } = useSelector((state) => state.accessToken);

    const [updateUserAccountInfo, { isLoading: updateUserAccountInfoLoading }] = useUpdateUserAccountInfoMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await updateUserAccountInfo({ name, accessToken });
        if (res?.data?.name === name) {
            toast.success("Account updated successfully",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            );
        }
        else {
            toast.error("Error, Please try again later",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            );
        }
    };

    const handleDeleteBtn = () => {
        navigate('/delete');
    };

    useEffect(() => {
        setName(userInfo?.name);
        setEmail(userInfo?.email);
        setActivate(userInfo?.is_active === true ? "Yes" : "No");
    }, [userInfo]);

    return (
        <MainContainer>
            <Sidebar />

            <Overlay />

            <ContentContainer>
                <div className={`mx-4 p-6 md:w-4/5 lg:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]}`}>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-3xl mb-5 text-center select-none"> Update Account </h2>

                        <div className="mb-4">
                            <label className="my-3 text-lg select-none">Name</label>
                            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className={`w-full p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]}`} />
                        </div>

                        <div className="mb-4">
                            <label className="my-3 text-lg select-none">Email</label>
                            <input disabled type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={`w-full cursor-not-allowed p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]}`} />
                        </div>

                        <div className="mb-6">
                            <label className="my-3 text-lg select-none"> Account Activated </label>
                            <input disabled type="text" name="accountActivated" value={activate} onChange={(e) => setActivate(e.target.value)} placeholder="Yes / No" className={`w-full cursor-not-allowed p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]}`} />
                        </div>

                        <GreenButton type="submit" additionalClasses="w-full mb-3" text={updateUserAccountInfoLoading ? <Loading /> : "Save"} />
                    </form>

                    <GreenButton onclick={handleDeleteBtn} additionalClasses="w-full bg-red-600 hover:bg-red-500" text="Delete Account" />
                </div>
            </ContentContainer>
        </MainContainer >
    );
}
