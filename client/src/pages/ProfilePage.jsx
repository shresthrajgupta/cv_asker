import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import SkillProficiency from "../components/SkillProficiency";
import Loading from "../components/Loading";

import { useLazyGetProfileQuery, usePatchProfileMutation } from "../redux/slices/async/profileApiSlice";

import { toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil";

const ProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [buttonClicked, setButtonClicked] = useState(false);

    const { accessToken } = useSelector((state) => state.accessToken);
    const { themeMode } = useSelector((state) => state.theme);

    const [getProfile, { data: getProfileData, isLoading: getProfileLoading }] = useLazyGetProfileQuery();
    const [patchProfile, { isLoading: patchProfileLoading }] = usePatchProfileMutation();

    useEffect(() => {
        const fetchData = async () => {
            if (accessToken !== "") {
                try {
                    await getProfile(accessToken).unwrap();
                } catch (err) {
                    console.log(err);
                }
            }
        };
            fetchData();
        }, [accessToken]);

        useEffect(() => {
            if (getProfileData?.skills.length > 0) {
                setProfile({ "Experience Level": getProfileData.experience_years, Skills: getProfileData.skills, jobProfile: getProfileData.job_profile });
            }
        }, [getProfileData]);

        useEffect(() => {
            const updateProfile = async () => {
                if (buttonClicked) {
                    try {
                        const res = await patchProfile({ profile, accessToken });
                        if (res.data && res.data.message === "Profile updated") {
                            toast.success("Profile updated successfully",
                                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                            )
                        }
                        else {
                            toast.error("Error updating profile",
                                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                            );
                        }
                    } catch (err) {
                    console.log(err);
                }
            }
            setButtonClicked(false);
        }

        updateProfile();
    }, [buttonClicked]);

    return (
        <div className="flex h-full w-full">
            <div className="basis-1/5 min-w-48">
                <Sidebar />
            </div>

            <div className="flex flex-col w-full justify-center items-center">
                {
                    getProfileLoading ? <Loading size={70} /> :
                        <SkillProficiency profile={profile} setProfile={setProfile} disableSubmitBtn={patchProfileLoading} isGetProfilePage={true} setButtonClicked={setButtonClicked} />
                }
            </div>
        </div>
    );
};

export default ProfilePage;