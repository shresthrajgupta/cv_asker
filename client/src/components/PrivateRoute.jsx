import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { useGetAccessTokenMutation, useLazyUserAccountInfoQuery } from "../redux/slices/async/usersApiSlice";

import { setAccessToken } from '../redux/slices/sync/accessTokenSlice.js';
import { setCredentials } from '../redux/slices/sync/authSlice.js';

import Loading from "./Loading";


const PrivateRoute = () => {
    const navigate = useNavigate();

    const { accessToken } = useSelector((state) => state.accessToken);
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [getAccessToken, { isLoading: getAccessTokenLoading }] = useGetAccessTokenMutation();
    const [userAccount, { isFetching: userAccountInfoFetching }] = useLazyUserAccountInfoQuery();

    useEffect(() => {
        const loginAgain = async () => {
            try {
                const accessTokenResponse = await getAccessToken().unwrap();
                if (!accessTokenResponse.access) {
                    navigate("/login");
                    return;
                }
                dispatch(setAccessToken(accessTokenResponse.access));

                const userAccountInfo = await userAccount(accessTokenResponse.access).unwrap();
                if (!userAccountInfo.id) {
                    navigate("/login");
                    return;
                }
                dispatch(setCredentials({ ...userAccountInfo }));
            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        if (!accessToken || accessToken === "" || !userInfo || userInfo === null) {
            loginAgain();
        }

        if (!userAccountInfoFetching && userInfo && !userInfo?.is_active) {
            navigate("/login");
        }

        setTimeout(() => {
            loginAgain();
            console.log("5 minutes passed");

        }, 5 * 60 * 1000);
    }, [accessToken]);

    if ((!accessToken || !userInfo) && (getAccessTokenLoading || userAccountInfoFetching)) {
        return <Loading />;
    }

    return <Outlet />;
};

export default PrivateRoute;    