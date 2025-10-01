import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
        },

        removeCredentials: (state, action) => {
            state.userInfo = null;
        },
    }
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;