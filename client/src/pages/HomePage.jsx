import { useSelector } from "react-redux";

import Sidebar from "../components/Sidebar.jsx";
import MainContainer from "../components/MainContainer.jsx";
import Overlay from "../components/Overlay.jsx";
import ContentContainer from "../components/ContentContainer.jsx";

const HomePage = () => {
    return (
        // <div className="relative flex h-full w-full">
        //     {
        //         (window.innerWidth >= 768 || sidebarOpen) &&
        //         <div className="basis-1/5">
        //             <Sidebar />
        //         </div>
        //     }
        //     <div className="w-full">
        //         HomePage
        //     </div>
        // </div>

        <MainContainer>
            <Sidebar />

            <Overlay />

            <ContentContainer>
                HomePage (not implemented)
            </ContentContainer>
        </MainContainer>
    );
};

export default HomePage;