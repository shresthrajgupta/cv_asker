import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import { textColorTheme, textInputBackgroundColorTheme, contentBackgroundColor, toastBackgroundTheme, toastTextTheme, buttonColorTheme, buttonColorHoveredTheme, headingColorTheme, sectionTitleTheme } from "../utils/themeUtil";

const SkillProficiency = ({ profile, setProfile, disableSubmitBtn, isGetProfilePage = false, setButtonClicked }) => {
    const [experienceYears, setExperienceYears] = useState(0);
    const [jobProfile, setJobProfile] = useState("");
    const [skills, setSkills] = useState([{ name: "", proficiency: "1" }]);

    const { themeMode } = useSelector((state) => state.theme);

    const handleChange = (index, field, newValue) => {
        const updatedSkills = [...skills];
        updatedSkills[index][field] = newValue;
        setSkills(updatedSkills);
    };

    const addSkill = (skill = "") => {
        const lastSkill = skills[skills.length - 1];
        if (lastSkill.name !== "" && lastSkill.proficiency !== "") {
            setSkills([...skills, { name: skill, proficiency: "1" }]);
        }
    };

    const removeSkill = (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills.length > 0 ? updatedSkills : [{ name: "", proficiency: "" }]);
    };

    const handleSubmit = () => {
        let isError = false;
        skills.forEach((skill) => {
            if (skill.proficiency === "") {
                toast.error("Please enter proficiency level",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                isError = true;
                return;
            }
            if (Number(skill.proficiency) > 10) {
                toast.error("Invalid proficiency",
                    { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
                );
                isError = true;
                return;
            }
        });

        if (isError) {
            return;
        }

        const payload = {
            skills: skills.filter((s) => s.name.trim() && s.proficiency !== "").map((s) => ({
                name: s.name,
                proficiency: Number(s.proficiency),
            })),
            job_profile: jobProfile,
            experience_years: Number(experienceYears),
        };

        setProfile({ ...payload });
        setButtonClicked(true);
    };

    useEffect(() => {
        if (isGetProfilePage && profile.Skills && profile.Skills.length > 0) {
            setJobProfile(profile.jobProfile);
            setExperienceYears(Number(profile["Experience Level"]));

            setSkills([]);
            profile.Skills.forEach(skill => {
                setSkills(prev => [...prev, { name: skill.name, proficiency: skill.proficiency }]);
            });
        }
        else if (profile.Skills && profile.Skills.length > 0) {
            setExperienceYears(Number(profile["Experience Level"]));

            setSkills([]);
            profile.Skills.forEach(skill => {
                setSkills(prev => [...prev, { name: skill, proficiency: "" }]);
            });
        }
    }, [profile]);

    return (
        <div className={`p-6 ${contentBackgroundColor[themeMode]} rounded-xl md:w-3/5 lg:w-3/5 space-y-4 max-h-4/5 overflow-y-auto`}>
            <h2 className={`py-3 text-2xl text-center select-none ${headingColorTheme[themeMode]}`}>Are these information accurate?</h2>

            <div className="flex gap-2 w-full">
                <div className="w-2/5 flex items-center min-w-[120px] select-none">Job Profile</div>
                <input type="text" disabled={disableSubmitBtn} placeholder="Ex: Lawyer" value={jobProfile} onChange={(e) => setJobProfile(e.target.value)} className={`w-1/2 p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />
            </div>

            <div className="flex gap-2 w-full">
                <div className="w-2/5 flex items-center min-w-[120px] select-none">Experience (Years)</div>
                <input type="number" disabled={disableSubmitBtn} placeholder="Enter Experience (in Years)" value={experienceYears} min={0} max={50} onChange={(e) => setExperienceYears(e.target.value)} className={`w-1/2 p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />
            </div>

            <h2 className={`my-3 text-lg font-semibold select-none ${sectionTitleTheme[themeMode]}`}>Skills</h2>

            {skills.map((skill, index) => (
                <div key={index} className="flex gap-2 w-full">
                    <input type="text" disabled={disableSubmitBtn} placeholder="Skill name" value={skill.name} onChange={(e) => handleChange(index, "name", e.target.value)} className={`w-2/5 min-w-[120px] p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />

                    <input type="number" disabled={disableSubmitBtn} placeholder="Proficiency (1-10)" value={skill.proficiency} min={1} max={10} onChange={(e) => handleChange(index, "proficiency", e.target.value)} className={`w-1/2 p-2 rounded focus:outline-none border-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />

                    <button type="button" onClick={() => removeSkill(index)} className={`pl-2 py-2 text-red-500 ${!disableSubmitBtn && "hover:text-red-700"} flex justify-end w-auto`} >
                        <Trash size={22} />
                    </button>
                </div>
            ))}

            <button type="button" disabled={disableSubmitBtn} onClick={() => addSkill()} className={`flex items-center gap-2 ${textColorTheme[themeMode]} ${!disableSubmitBtn && "hover:underline"} select-none`} >
                <Plus size={18} /> Add Skill
            </button>

            <button type="button" disabled={disableSubmitBtn} onClick={handleSubmit} className={`px-4 py-2 ${textColorTheme[themeMode]} ${buttonColorTheme[themeMode]} ${!disableSubmitBtn && buttonColorHoveredTheme[themeMode]} rounded flex justify-center items-center`} >
                {disableSubmitBtn ? <ClipLoader color={textColorTheme[themeMode]} /> : (isGetProfilePage ? "Update" : "Submit")}
            </button>
        </div >
    );
};

export default SkillProficiency;
