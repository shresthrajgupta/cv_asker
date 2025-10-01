import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";

import { useLazyGetProfileQuery, usePatchProficiencyMutation } from "../redux/slices/async/profileApiSlice";
import { useGetQuestionsMutation, useStoreQuestionsMutation } from "../redux/slices/async/questionApiSlice";
import { useStoreQuestionHistoryMutation } from "../redux/slices/async/userHistorySlice";

import { buttonColorFocusedTheme, buttonColorHoveredTheme, buttonColorTheme, buttonTextColorTheme, contentBackgroundColor } from "../utils/themeUtil";

const PracticePage = () => {
    const [skills, setSkills] = useState([]);
    const [skillToAsk, setSkillToAsk] = useState({});
    const [isQuestionsSection, setIsQuestionsSection] = useState(false);
    const [questionArray, setQuestionArray] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState("");
    const [isOptionChecked, setIsOptionChecked] = useState(false);
    const [ifFinalDialogue, setIsFinalDialogue] = useState(false);

    const totalScore = useRef(0);

    const { accessToken } = useSelector((state) => state.accessToken);
    const { themeMode } = useSelector((state) => state.theme);

    const [getProfile, { isLoading: getProfileLoading }] = useLazyGetProfileQuery();
    const [getQuestions, { isLoading: getQuestionsLoading }] = useGetQuestionsMutation();
    const [storeQuestions, { isLoading: storeQuestionsLoading }] = useStoreQuestionsMutation();
    const [patchProficiency, { isLoading: patchProficiencyLoading }] = usePatchProficiencyMutation();
    const [storeQuestionHistory, { isLoading: storeQuestionHistoryLoading }] = useStoreQuestionHistoryMutation();

    const checkQuestion = (option) => {
        if (!isOptionChecked) {
            setCurrentOptionSelected(option);
        }
        setIsOptionChecked(true);
    };

    const nextQuestion = async () => {
        if (currentQuestion < questionArray.length - 1) {
            if (questionArray[currentQuestion].correct_ans.toLowerCase() === currentOptionSelected) {
                totalScore.current += 1;
                storeQuestionHistory({ payload: { question_id: questionArray[currentQuestion].id, answered_correctly: true }, accessToken });
            }
            else {
                storeQuestionHistory({ payload: { question_id: questionArray[currentQuestion].id, answered_correctly: false }, accessToken });
            }

            setCurrentQuestion(currentQuestion + 1);
            setIsOptionChecked(false);
        }
        else {
            console.log("error in nextQuestion function");
        }
    };
    const finishQuestion = async () => {
        if (currentQuestion === questionArray.length - 1) {
            try {
                if (questionArray[currentQuestion].correct_ans.toLowerCase() === currentOptionSelected) {
                    totalScore.current += 1;
                    storeQuestionHistory({ payload: { question_id: questionArray[currentQuestion].id, answered_correctly: true }, accessToken });
                }
                else {
                    storeQuestionHistory({ payload: { question_id: questionArray[currentQuestion].id, answered_correctly: false }, accessToken });
                }

                if (totalScore.current >= 9 && skillToAsk.proficiency < 10) {
                    await patchProficiency({ payload: { skill: skillToAsk.skill, action: "increase" }, accessToken }).unwrap();
                }
                else if (totalScore.current <= 5 && skillToAsk.proficiency > 0) {
                    await patchProficiency({ payload: { skill: skillToAsk.skill, action: "decrease" }, accessToken }).unwrap();
                }

                setIsFinalDialogue(true);
            } catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("error in nextQuestion function");
        }
    };

    const fetchQuestions = async () => {
        if (skillToAsk.skill && skillToAsk.proficiency) {
            try {
                setIsQuestionsSection(true);
                const res = await getQuestions({ skillToAsk, accessToken }).unwrap();

                if (res.data) {
                    setQuestionArray(res.data);
                }
                else {
                    console.log(res);
                    setIsQuestionsSection(false);
                }

                storeQuestions({ skillToAsk, accessToken }).unwrap();
            } catch (err) {
                setIsQuestionsSection(false);
                console.log(err);
            }
        }
    };

    const restartSameQuestionTopic = () => {
        fetchQuestions();

        setCurrentQuestion(0);
        setCurrentOptionSelected("");
        setIsOptionChecked(false);
        setIsFinalDialogue(false);
    };

    const goBackToSkillList = () => {
        setSkillToAsk({});
        setIsQuestionsSection(false);
        setQuestionArray([]);
        setCurrentQuestion(0);
        setCurrentOptionSelected("");
        setIsOptionChecked(false);
        setIsFinalDialogue(false);
    };

    useEffect(() => {
        if (skillToAsk.skill && skillToAsk.proficiency) {
            fetchQuestions();
        }
    }, [skillToAsk]);

    useEffect(() => {
        const fetchData = async () => {
            if (accessToken !== "") {
                try {
                    const res = await getProfile(accessToken).unwrap();
                    setSkills(res.skills);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchData();
    }, []);


    return (
        <div className="flex h-full w-full">
            <div className="basis-1/5 min-w-48 flex justify-start">
                <Sidebar />
            </div>
            <div className="w-full">
                {
                    !ifFinalDialogue && !isQuestionsSection && (
                        getProfileLoading ?
                            <div className="mt-16">
                                <Loading size={70} />
                            </div>
                            :

                            <>
                                <h2 className="text-3xl text-center my-8 cursor-default">What do you want to practice?</h2>
                                <div className={`text-center`}>
                                    <button onClick={() => setSkillToAsk(skills[Math.floor(Math.random() * skills.length)])} className={`text-xl ${buttonColorTheme[themeMode]} ${buttonColorFocusedTheme[themeMode]} ${buttonColorHoveredTheme[themeMode]} ${buttonTextColorTheme[themeMode]} p-2 rounded-lg`}>
                                        Choose Randomly
                                    </button>
                                </div>
                                <div className="w-[95%] mx-auto p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {skills.map((item, index) => (
                                        <div key={index} onClick={() => setSkillToAsk({ skill: item.name, proficiency: item.proficiency })} className={`p-4 rounded-2xl shadow-md hover:shadow-lg transition ${contentBackgroundColor[themeMode]}`}>
                                            <h2 className="font-semibold text-lg cursor-default">{item.name}</h2>
                                            <p className="mt-1 text-sm cursor-default">Proficiency: {item.proficiency}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                    )
                }

                {
                    !ifFinalDialogue && isQuestionsSection && (
                        getQuestionsLoading ?
                            <div className="mt-16">
                                <Loading size={70} />
                            </div>
                            :
                            <>
                                <div className="flex justify-end items-center mt-6 mr-20">
                                    <button onClick={goBackToSkillList} className={`${buttonColorTheme[themeMode]} ${buttonTextColorTheme[themeMode]} p-2 rounded-lg`}>Exit Questions</button>
                                </div>

                                <div className="max-w-xl mx-auto p-6">
                                    <div className={`p-6 rounded-2xl shadow-md ${contentBackgroundColor[themeMode]}`}>
                                        <h2 className="text-lg font-semibold mb-4 select-none">
                                            Q{currentQuestion + 1}. {questionArray[currentQuestion].question}
                                        </h2>

                                        <div className="space-y-2">
                                            {[questionArray[currentQuestion].option_a, questionArray[currentQuestion].option_b, questionArray[currentQuestion].option_c, questionArray[currentQuestion].option_d].map((opt, i) => (
                                                <div key={i} onClick={() => { checkQuestion(String.fromCharCode('a'.charCodeAt(0) + i)) }} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition select-none ${isOptionChecked && ((questionArray[currentQuestion].correct_ans.toLowerCase() === String.fromCharCode('a'.charCodeAt(0) + i)) ? "border-green-500" : "border-red-500")}`}>
                                                    {/* <input type="radio" name={`question-${currentQuestion}`} id={`q${currentQuestion}-opt${i}`} className="mr-3 cursor-pointer" /> */}
                                                    {/* <label htmlFor={`q${currentQuestion}-opt${i}`} className="cursor-pointer"> {opt} </label> */}
                                                    <strong className="flex-shrink-0 h-full">{String.fromCharCode('a'.charCodeAt(0) + i)}. &nbsp; </strong>
                                                    <p className="flex-1"> {opt} </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        {
                                            (currentQuestion !== questionArray.length - 1) &&
                                            <button disabled={!isOptionChecked} onClick={nextQuestion} className={`px-4 py-2 rounded-lg ${buttonColorTheme[themeMode]} ${buttonTextColorTheme[themeMode]} disabled:opacity-50`} >
                                                Next
                                            </button>
                                        }

                                        {
                                            (currentQuestion === questionArray.length - 1) &&
                                            <button disabled={!isOptionChecked} onClick={finishQuestion} className={`px-4 py-2 rounded-lg ${buttonColorTheme[themeMode]} disabled:opacity-50`} >
                                                Finish
                                            </button>
                                        }

                                    </div>
                                </div>
                            </>
                    )
                }

                {
                    ifFinalDialogue && (
                        patchProficiencyLoading ? <Loading size={70} /> :
                            <>
                                <div className={`max-w-md mx-auto mt-10 p-6 rounded-xl shadow-lg text-center ${contentBackgroundColor[themeMode]}`}>
                                    <h2 className="text-2xl font-bold  mb-4">
                                        Your score is{" "}
                                        <span className="text-indigo-600">
                                            {totalScore.current}
                                        </span>
                                    </h2>

                                    <p className=" mb-6">Do you want to practice more?</p>

                                    <div className="flex justify-center gap-4">
                                        <button onClick={restartSameQuestionTopic} className={`px-6 py-2 ${buttonColorTheme[themeMode]} ${buttonTextColorTheme[themeMode]} rounded-lg hover:opacity-70 transition`}> Yes </button>

                                        <button onClick={goBackToSkillList} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"> Go back </button>
                                    </div>
                                </div>

                            </>
                    )
                }
            </div>
        </div >
    );
};

export default PracticePage;