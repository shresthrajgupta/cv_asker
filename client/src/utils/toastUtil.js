import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (message, theme) => {
    const styles = {
        success: {
            background: "#4caf50", // green
            color: "#fff"
        },
        error: {
            background: "#f44336", // red
            color: "#fff"
        },
        info: {
            background: "#2196f3", // blue
            color: "#fff"
        },
        light: {
            background: "#f5f5f5",
            color: "#1f1f1f"
        },
        dark: {
            background: "#121212",
            color: "#f5f5f5"
        },
    };

    toast(message,
        {
            style: styles[theme] || {}
        });
};