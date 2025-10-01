import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";


const Loading = (props) => {
    const { themeMode } = useSelector((state) => state.theme);

    return (
        <div className="flex justify-center items-center">
            <ClipLoader size={props.size || 24} color={themeMode === 'dark' ? '#e2e5e9' : '#65686c'} />
        </div>
    );
};

export default Loading;