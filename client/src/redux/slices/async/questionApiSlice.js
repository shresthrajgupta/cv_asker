import { apiSlice } from './apiSlice.js';


export const questionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuestions: builder.mutation({
            query: ({ skillToAsk, accessToken }) => {
                return {
                    url: "/api/question/fetch",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: skillToAsk,
                    credentials: "include"
                }
            }
        }),

        storeQuestions: builder.mutation({
            query: ({ skillToAsk, accessToken }) => {
                return {
                    url: "/api/question/store",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: skillToAsk,
                    credentials: "include"
                }
            }
        }),
    })
});

export const
    {
        useGetQuestionsMutation,
        useStoreQuestionsMutation,
    } = questionApiSlice;