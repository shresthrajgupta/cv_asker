import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: ""
};


const accessTokenSlice = createSlice({
    name: "accessToken",
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },

        removeAccessToken: (state, action) => {
            state.accessToken = "";
        },
    }
});

export const { setAccessToken, removeAccessToken } = accessTokenSlice.actions;

export default accessTokenSlice.reducer;