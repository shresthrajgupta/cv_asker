import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';

import { useVerifyAccountMutation } from '../redux/slices/async/usersApiSlice.js';

import Loading from '../components/Loading.jsx';

import { backgroundColorTheme, textColorTheme } from '../utils/themeUtil.js';

const AccountActivatedPage = () => {
    const location = useLocation();

    const [activated, setActivated] = useState(false);

    const themeMode = useSelector((state) => state.theme);

    const [verifyAccount, { isLoading: verifyAccountLoading }] = useVerifyAccountMutation();

    useEffect(() => {
        const verify = async () => {
            const uid = location.pathname.split('/')[2];
            const token = location.pathname.split('/')[3];

            try {
                await verifyAccount({ uid, token }).unwrap();
                setActivated(true);
            } catch (err) {
                setActivated(false);
            }
        };

        verify();
    }, []);


    return (
        <>
            {
                verifyAccountLoading ? <Loading size={70} /> :
                    activated ?
                        <div div className={`flex items-center justify-center min-h-screen ${backgroundColorTheme[themeMode]} ${textColorTheme[themeMode]}`}>
                            <div className="text-center">
                                <h1 className="text-6xl font-bold mb-4 select-none">Account Activated :)</h1>
                                <p className="text-2xl mb-8 select-none">You can login to you account now</p>
                                <Link to="/login" className={`${textColorTheme[themeMode]} hover:underline`}>
                                    Go to Login
                                </Link>
                            </div>
                        </div >
                        :
                        <div div className={`flex items-center justify-center min-h-screen ${backgroundColorTheme[themeMode]} ${textColorTheme[themeMode]}`}>
                            <div className="text-center">
                                <h1 className="text-6xl font-bold mb-4">Oops :(</h1>
                                <p className="text-2xl mb-8">Account activation failed, please try again later</p>
                            </div>
                        </div >
            }
        </>
    );
};

export default AccountActivatedPage;