import { useSelector, useDispatch } from "react-redux";

import { overlayTheme } from "../utils/themeUtil";

import { setSidebarOpen } from "../redux/slices/sync/sidebarOpenSlice.js";

const Overlay = () => {
    const dispatch = useDispatch();

    const { themeMode } = useSelector((state) => state.theme);
    const { sidebarOpen } = useSelector((state) => state.sidebarOpen);

    return (
        <div className={`fixed inset-0 ${overlayTheme[themeMode]} bg-opacity-50 transition-opacity duration-300  ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} md:hidden`} style={{ zIndex: 40 }} onClick={() => dispatch(setSidebarOpen(false))} />
    );
};

export default Overlay;