import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sidebarOpen: false
};


const sidebarOpenSlice = createSlice({
    name: "sidebarOpen",
    initialState,
    reducers: {
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        }
    }
});

export const { setSidebarOpen } = sidebarOpenSlice.actions;

export default sidebarOpenSlice.reducer;