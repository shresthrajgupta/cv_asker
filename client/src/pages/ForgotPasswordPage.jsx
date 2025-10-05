import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import logo from "../assets/logo.svg";

import GreenButton from "../components/GreenButton";
import Loading from "../components/Loading";

import { useResetPasswordMutation, useSetNewPasswordMutation } from "../redux/slices/async/usersApiSlice";

import { contentBackgroundColor, sectionTitleTheme, textInputBorderColorTheme, textInputBorderColorFocusedTheme, textInputBackgroundColorTheme, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

const ForgotPasswordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [uid, setUid] = useState();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const [isLinkSent, setIsLinkSent] = useState(false);
    const [isError, setIsError] = useState(false);

    const { themeMode } = useSelector((state) => state.theme);

    const [resetPassword, { isLoading: resetPasswordLoading }] = useResetPasswordMutation();
    const [setNewPassword, { isLoading: setNewPasswordLoading }] = useSetNewPasswordMutation();

    const handleSendLinkSubmit = async (e) => {
        e.preventDefault();

        setIsError(false);

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            toast.error("Enter valid email", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }

        try {
            const res = await resetPassword(email).unwrap();

            if (res === null) {
                toast.success("If email exists in our database then you will receive an email",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                setEmail("");
            }
            else {
                toast.error("Error sending e-mail, Please try again",
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

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();

        setIsError(false);

        if (!password || password.length < 8 || password.length > 25) {
            toast.error("Password must be between 8 to 25 characters", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }
        if (!rePassword || rePassword.length < 8 || rePassword.length > 25) {
            toast.error("Password must be between 8 to 25 characters", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }
        if (password !== rePassword) {
            toast.error("Passwords do not match", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }

        try {
            const res = await setNewPassword({ uid, token, password, rePassword }).unwrap();

            if (res === null) {
                toast.success("Password changes successfully",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                navigate("/login");
            }
            else {
                toast.error("Error changing password, Please try again",
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

    useEffect(() => {
        const pathArray = location.pathname.split('/').filter(Boolean);
        if (pathArray.length > 1) {
            setIsLinkSent(true);
            setUid(pathArray[1]);
            setToken(pathArray[2]);
        }
    }, []);

    return (
        <>
            {!isLinkSent &&
                <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
                    <div className="flex flex-col items-center px-6">
                        <img src={logo} alt='Logo' className="w-32" />
                        <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]}`}>Reset Password</p>
                    </div>

                    <div className="p-6 w-full max-w-sm">
                        <form onSubmit={handleSendLinkSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block">Email</label>
                                <input type="email" id="email" name="email" disabled={resetPasswordLoading} value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]} ${resetPasswordLoading && "cursor-not-allowed"}`} placeholder="Enter e-mail" required />
                            </div>

                            <GreenButton text={resetPasswordLoading ? <Loading /> : "Send Link"} type="submit" disabled={resetPasswordLoading} additionalClasses="w-full" />
                        </form>
                    </div>
                </div>
            }

            {isLinkSent &&
                <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
                    <div className="flex flex-col items-center px-6">
                        <img src={logo} alt='Logo' className="w-32" />
                        <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]}`}>Set new password</p>
                    </div>

                    <div className="p-6 w-full max-w-sm">
                        <form onSubmit={handleResetPasswordSubmit}>
                            <div className="mb-4">
                                <label htmlFor="password" className="block">Password</label>
                                <input disabled={setNewPasswordLoading} type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]} ${setNewPasswordLoading && "cursor-not-allowed"}`} placeholder="Enter password" required />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirm_password" className="block">Confirm Password:</label>
                                <input disabled={setNewPasswordLoading} type="password" id="confirm_password" name="confirm_password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]} ${setNewPasswordLoading && "cursor-not-allowed"}`} placeholder="Confirm Password" required />
                            </div>

                            <GreenButton text={setNewPasswordLoading ? <Loading /> : "Reset Password"} type="submit" disabled={setNewPasswordLoading} additionalClasses="w-full" />
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default ForgotPasswordPage