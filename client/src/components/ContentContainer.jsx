import { useSelector } from "react-redux";

const ContentContainer = ({ children }) => {
    const { sidebarOpen } = useSelector((state) => state.sidebarOpen);

    return (
        <div className={`mx-4 flex flex-col w-full justify-center items-center transition-all duration-300  ${sidebarOpen ? 'pointer-events-none select-none blur-[2px]' : 'pointer-events-auto'}`}>
            {children}
        </div>
    );
};

export default ContentContainer;