import { apiSlice } from './apiSlice.js';

export const userHistorySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        storeQuestionHistory: builder.mutation({
            query: ({ payload, accessToken }) => {
                return {
                    url: "/api/history/update",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: payload,
                    credentials: "include"
                }
            }
        }),
    })
});

export const
    {
        useStoreQuestionHistoryMutation,
    } = userHistorySlice;