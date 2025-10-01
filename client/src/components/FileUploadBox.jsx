import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { sectionTitleTheme, fileUploadBorderColorTheme, toastBackgroundTheme, toastTextTheme } from "../utils/themeUtil.js";

const FileUploadBox = ({ onFileSelect }) => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");

    const { themeMode } = useSelector((state) => state.theme);

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        const format = file.name.slice(-3);

        if (file && (format.toLowerCase() === "pdf")) {
            setFileName(file.name);
            onFileSelect(file);
        }
        else {
            toast.error("Only PDFs are supported",
                { style: { background: toastBackgroundTheme[themeMode], color: toastTextTheme[themeMode] } }
            )
        }
    };

    return (
        <div title="PDF Upload Box">
            <div onClick={handleDivClick} className={`border-2 border-dashed p-6 text-center cursor-pointer rounded-xl ${fileUploadBorderColorTheme[themeMode]}`}>
                {fileName ? (<p className="text-green-600">{fileName}</p>) : (<p className={`select-none ${sectionTitleTheme[themeMode]}`}>Click here to upload a PDF</p>)}
            </div>

            <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
    );
};

export default FileUploadBox;
