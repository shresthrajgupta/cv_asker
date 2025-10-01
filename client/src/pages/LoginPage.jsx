import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { ClipLoader } from 'react-spinners';
import { toast } from "react-toastify";

import logo from "../assets/logo.svg";

import { useLoginMutation, useLazyUserAccountInfoQuery } from '../redux/slices/async/usersApiSlice';

import { setAccessToken } from '../redux/slices/sync/accessTokenSlice.js';
import { setCredentials } from '../redux/slices/sync/authSlice.js';

import { contentBackgroundColor, buttonTextColorTheme, sectionTitleTheme, textInputBorderColorTheme, textInputBorderColorFocusedTheme, textInputBackgroundColorTheme, buttonColorTheme, buttonColorHoveredTheme, buttonColorFocusedTheme, toastBackgroundTheme, toastTextTheme, textColorTheme } from '../utils/themeUtil.js';

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);

    const dispatch = useDispatch();

    const [login, { isLoading: loginLoading }] = useLoginMutation();
    const [userAccount, { data: userAccountInfoData, isFetching: userAccountInfoFetching }] = useLazyUserAccountInfoQuery();

    const { userInfo } = useSelector((state) => state.auth);
    const { themeMode } = useSelector((state) => state.theme);

    useEffect(() => {
        if (userInfo) {
            navigate('/home');
        }
    }, [navigate, userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsError(false);

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

        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setAccessToken(res.access));

            const userAccountInfo = await userAccount(res.access).unwrap();
            dispatch(setCredentials({ ...userAccountInfo }));

            navigate("/home");
        } catch (err) {
            if (err.status && Math.floor(err.status / 100) === 4) {
                toast.error("Incorrect username or password",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                )
            }
            else {
                console.log(err);
                toast.error("Internal server error, please try again later",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                )
            }
        }
    }

    return (
        <div className={`flex flex-col items-center justify-center mx-4 py-6 md:w-[400px] rounded-xl ${contentBackgroundColor[themeMode]} shadow-lg`}>
            <div className="flex flex-col items-center px-6">
                <img src={logo} alt='Logo' className="w-32" />
                <p className={`text-xl md:text-2xl ${sectionTitleTheme[themeMode]} select-none`}>Log in to CV-Asker</p>
            </div>

            <div className="p-6 w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block select-none">Email:</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]}`} placeholder="xyz@email.com" required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block select-none">Password:</label>
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${isError ? 'border-red-500' : textInputBorderColorTheme[themeMode]} ${textInputBorderColorFocusedTheme[themeMode]} ${textInputBackgroundColorTheme[themeMode]}`} placeholder="p@sswOrd" required />
                    </div>

                    <button type="submit" disabled={loginLoading} className={`w-full ${buttonTextColorTheme[themeMode]} ${buttonColorTheme[themeMode]} py-2 rounded-lg ${buttonColorHoveredTheme[themeMode]} focus:outline-none ${buttonColorFocusedTheme[themeMode]} flex justify-center items-center`}> {loginLoading ? <ClipLoader size={24} color={textColorTheme[themeMode]} /> : "Log In"} </button>
                </form>
            </div>

            <div> <Link to="/password-reset" className="hover:underline select-none" > Forgot Password? </Link> </div>
            <div> <Link to="/signup" className="hover:underline select-none"> Don't have an account? </Link> </div>
        </div>
    );
};

export default LoginPage;