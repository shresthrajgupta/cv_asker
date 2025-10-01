import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./slices/async/apiSlice.js";
import authSliceReducer from "./slices/sync/authSlice.js";
import accessTokenSliceReducer from "./slices/sync/accessTokenSlice.js";
import themeSliceReducer from "./slices/sync/themeSlice.js";


const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        theme: themeSliceReducer,
        accessToken: accessTokenSliceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;