import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import FileUploadBox from "../components/FileUploadBox";
import CustomFields from "../components/CustomFields";
import SkillProficiency from "../components/SkillProficiency";
import WarningReload from "../components/WarningReload.jsx";

import { useUploadPDFMutation } from "../redux/slices/async/cvApiSlice";
import { useSaveProfileMutation } from "../redux/slices/async/profileApiSlice.js";

import { contentBackgroundColor, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil.js"


const UploadCVPage = () => {
    const [isUploadSection, setIsUploadSection] = useState(true);
    const [isCustomFieldsSection, setIsCustomFieldsSection] = useState(false);
    const [isExtractedDataSection, setIsExtractedDataSection] = useState(false);

    const [file, setFile] = useState(null);
    const [customFields, setCustomFields] = useState([]);
    const [profile, setProfile] = useState({});

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    WarningReload(hasUnsavedChanges);

    const { themeMode } = useSelector((state) => state.theme);
    const { accessToken } = useSelector((state) => state.accessToken);

    const [uploadPDF, { isLoading: uploadPDFLoading }] = useUploadPDFMutation();
    const [saveProfile, { isLoading: saveProfileLoading }] = useSaveProfileMutation();


    useEffect(() => {
        if (file) {
            setIsUploadSection(false);
            setIsCustomFieldsSection(true);
            setIsExtractedDataSection(false);

            setHasUnsavedChanges(true);
        }
        else {
            setIsUploadSection(true);
            setIsCustomFieldsSection(false);
            setIsExtractedDataSection(false);


            setHasUnsavedChanges(false);
        }
    }, [file]);

    useEffect(() => {
        const extractSkills = async () => {
            if (customFields.length > 0) {
                try {
                    const res = await uploadPDF({ file: file, custom_fields: customFields, accessToken });
                    if (res.data) {
                        setProfile(res.data.data);

                        setIsUploadSection(false);
                        setIsCustomFieldsSection(false);
                        setIsExtractedDataSection(true);
                    }

                } catch (err) {
                    setIsUploadSection(false);
                    setIsCustomFieldsSection(true);
                    setIsExtractedDataSection(false);

                    toast.error(err,
                        { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                    );
                }
            }
        }

        extractSkills();
    }, [customFields]);

    useEffect(() => {
        const finishProfile = async () => {
            if (profile.skills && profile.skills.length > 0) {
                if (profile.job_profile) {
                    try {
                        const res = await saveProfile({ profile, accessToken });

                        if (res.data.message && res.data.message === "Profile created successfully") {
                            setIsUploadSection(true);
                            setIsCustomFieldsSection(false);
                            setIsExtractedDataSection(false);

                            toast.success("Profile created successfully",
                                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                            );

                            setFile(null);
                            setCustomFields([]);
                            setProfile({});
                        }
                        else {
                            setIsUploadSection(false);
                            setIsCustomFieldsSection(false);
                            setIsExtractedDataSection(true);

                            toast.error(err,
                                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                            );
                        }

                    } catch (err) {
                        setIsUploadSection(false);
                        setIsCustomFieldsSection(false);
                        setIsExtractedDataSection(true);

                        toast.error(err,
                            { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                        );
                    }
                }
                else {
                    setProfile({ ...profile.data.data });

                    setIsUploadSection(false);
                    setIsCustomFieldsSection(false);
                    setIsExtractedDataSection(true);
                }
            }
        }

        finishProfile();
    }, [profile]);

    return (
        <div className="flex h-full w-full">
            <div className="basis-1/5 min-w-48">
                <Sidebar />
            </div>
            <div className="flex flex-col w-full justify-center items-center">
                {
                    isUploadSection && <>
                        <div className={`mx-4 p-6 md:w-[600px] rounded-xl ${contentBackgroundColor[themeMode]}`}>
                            <p className="text-xl mb-5 text-center select-none">You can upload your CV without any worries. <br /> This tool will not use your personal information for anything</p>
                            <FileUploadBox onFileSelect={(file) => setFile(file)} />
                        </div>
                    </>
                }

                {
                    isCustomFieldsSection && <>
                        <CustomFields setCustomFields={setCustomFields} disableSubmitBtn={uploadPDFLoading} />
                    </>
                }

                {
                    isExtractedDataSection && <>
                        <SkillProficiency profile={profile} setProfile={setProfile} disableSubmitBtn={saveProfileLoading} />
                    </>
                }
            </div>
        </div>
    );
};

export default UploadCVPage;