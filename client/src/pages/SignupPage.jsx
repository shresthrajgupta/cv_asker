import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import logo from "../assets/logo.svg";

import GreenButton from '../components/GreenButton.jsx';
import Loading from '../components/Loading.jsx';

import { useSignupMutation } from '../redux/slices/async/usersApiSlice';

import { textInputBorderColorTheme, sectionTitleTheme, contentBackgroundColor, textInputBorderColorFocusedTheme, textInputBackgroundColorTheme, toastTextTheme, toastBackgroundTheme } from "../utils/themeUtil.js";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");

    const [isError, setIsError] = useState(false);

    const { themeMode } = useSelector((state) => state.theme);

    const [signup, { isLoading: signupLoading }] = useSignupMutation();


    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            toast.error("Enter valid email", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }
        if (!password || password.length < 8 || password.length > 25) {
            toast.error("Password must be between 8 to 25 characters", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }
        if (!retypePassword || retypePassword.length < 8 || retypePassword.length > 25) {
            toast.error("Password must be between 8 to 25 characters", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }
        if (password !== retypePassword) {
            toast.error("Passwords do not match", { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } });
            setIsError(true);
            return;
        }

        try {
            const res = await signup({ email, password, re_password: retypePassword }).unwrap();

            if (res?.email === email) {
                setEmail("");
                setPassword("");
                setRetypePassword("");
                toast.success("Activation link sent to Email ID",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                )
            }
        } catch (err) {
            console.log(err);
            toast.error((err?.data?.email?.length > 0 && "Email: " + err?.data?.email[0]) || (err?.data?.password?.length > 0 && "Password: " + err?.data?.password[0]) || (err?.data?.re_password?.length > 0 && "Retype Password: " + err?.data?.re_password[0]) || err,
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            );
        }

    };

    return (
        <>
            <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
                <div className="flex flex-col items-center px-6">
                    <img src={logo} alt='Logo' className="w-32" />
                    <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]} select-none`}>Practice smarter, answer better.</p>
                </div>

                <div className="p-6 w-full max-w-sm">
                    <form onSubmit={handleSignupSubmit}>

                        <div className="mb-4">
                            <label htmlFor="email" className="block select-none">Email:</label>
                            <input disabled={signupLoading} type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2 border rounded focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]} ${signupLoading && "cursor-not-allowed"}`} placeholder="xyz@email.com" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block select-none">Password:</label>
                            <input disabled={signupLoading} type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-3 py-2 border rounded focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]} ${signupLoading && "cursor-not-allowed"}`} placeholder="p@sswOrd" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="retypePassword" className="block select-none">Retype Password:</label>
                            <input disabled={signupLoading} type="password" id="retypePassword" name="retypePassword" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} className={`w-full px-3 py-2 border rounded focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]} ${signupLoading && "cursor-not-allowed"}`} placeholder="p@sswOrd" />
                        </div>

                        <GreenButton type="submit" disabled={signupLoading} additionalClasses="w-full" text={signupLoading ? <Loading /> : "Sign Up"} />
                    </form>
                </div>

                <div>
                    {
                        signupLoading
                            ?
                            <div className="hover:underline select-none"> Already have an account? </div>
                            :
                            <Link to="/login" className="hover:underline select-none"> Already have an account? </Link>
                    }
                </div>
            </div >
        </>
    );
};

export default SignUpPage;