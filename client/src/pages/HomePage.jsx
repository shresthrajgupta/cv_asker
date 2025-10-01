import Sidebar from "../components/Sidebar.jsx";

const HomePage = () => {


    return (
        <div className="flex h-full w-full">
            <div className="basis-1/5 min-w-48 flex justify-start">
                <Sidebar />
            </div>
            <div>HomePage</div>
        </div>
    );
};

export default HomePage;