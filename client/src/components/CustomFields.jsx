import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Trash } from "lucide-react";
import { ClipLoader } from "react-spinners";

import { textColorTheme, contentBackgroundColor, buttonColorTheme, buttonColorHoveredTheme, textInputBackgroundColorTheme } from "../utils/themeUtil";

const placeholdersArray = [{ "College": "Indian Institute of Technology Kharagpur" }, { "Company": "ABC Pvt. Ltd." }, { "Company 2": "XYX Pvt. Ltd." }, { "Category": "Actual Value" }];
let placeholdersIndex = 0;

const CustomFields = ({ setCustomFields, disableSubmitBtn }) => {
    const [fields, setFields] = useState([{ key: "", value: "" }]);

    const { themeMode } = useSelector((state) => state.theme);

    const handleChange = (index, field, newValue) => {
        const updatedFields = [...fields];
        updatedFields[index][field] = newValue;
        setFields(updatedFields);
    };

    const addField = () => {
        placeholdersIndex = Math.min(placeholdersIndex + 1, placeholdersArray.length - 1);
        const lastField = fields.at(-1);

        if (lastField["key"] !== "" && lastField["value"] !== "") {
            setFields([...fields, { key: "", value: "" }]);
        }
    };

    const removeField = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields.length > 0 ? updatedFields : [{ key: "", value: "" }]);
    };

    const handleSubmit = () => {
        const result = fields
            .filter(f => f.key.trim() && f.value.trim())
            .map(f => ({ [f.key]: f.value }));

        setCustomFields(result);
    };

    return (
        <div className={`p-6 ${contentBackgroundColor[themeMode]} rounded-xl md:w-4/5 lg:w-3/5 space-y-4 max-h-4/5 overflow-y-auto`}>
            <h2 className="py-3 text-lg text-center select-none">This tool automatically captures key personal info. You can also remove any sensitive fields before processing. Please enter exact values as mentioned in resume.</h2>

            <h2 className="my-3 text-lg font-semibold select-none">Enter Info</h2>
            {fields.map((field, index) => (
                <div key={index} className="flex gap-2 w-full">
                    <input type="text" disabled={disableSubmitBtn} placeholder={Object.keys(placeholdersArray[placeholdersIndex])} value={field.key} onChange={(e) => handleChange(index, "key", e.target.value)} className={`lg-w-1/3 min-w-[30] border p-2 rounded border-none focus:outline-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />

                    <input type="text" disabled={disableSubmitBtn} placeholder={Object.values(placeholdersArray[placeholdersIndex])} value={field.value} onChange={(e) => handleChange(index, "value", e.target.value)} className={`w-3/5 border p-2 rounded border-none focus:outline-none ${textInputBackgroundColorTheme[themeMode]} ${disableSubmitBtn && "cursor-not-allowed"}`} />

                    <button type="button" disabled={disableSubmitBtn} onClick={() => removeField(index)} className={`min-w-10 pl-2 py-2 text-red-500 ${!disableSubmitBtn && "hover:text-red-700"} flex justify-end`} > <Trash size={22} /> </button>
                </div>
            ))
            }

            <button type="button" disabled={disableSubmitBtn} onClick={addField} className={`flex items-center gap-2 select-none ${textColorTheme[themeMode]} ${!disableSubmitBtn && "hover:underline"}`} >
                <Plus size={18} /> Add Field
            </button>

            <button type="button" disabled={disableSubmitBtn} onClick={handleSubmit} className={`px-4 py-2 ${textColorTheme[themeMode]} ${buttonColorTheme[themeMode]} ${!disableSubmitBtn && buttonColorHoveredTheme[themeMode]} rounded flex items-center justify-center`} >
                {disableSubmitBtn ? <ClipLoader color={textColorTheme[themeMode]} /> : "Submit"}
            </button>
        </div >
    );
};

export default CustomFields;
