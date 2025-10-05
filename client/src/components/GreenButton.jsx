import { useSelector } from "react-redux";

import { buttonColorTheme } from "../utils/themeUtil";

const GreenButton = ({ text, type, onclick, disabled, additionalClasses }) => {
    const { themeMode } = useSelector((state) => state.theme);

    return (
        <button onClick={onclick} type={type} disabled={disabled} className={`${buttonColorTheme[themeMode]} text-white hover:opacity-85 disabled:opacity-50 p-2 rounded focus:outline-none flex justify-center items-center transition ${additionalClasses}`}>
            {text}
        </button>
    );
};

export default GreenButton;