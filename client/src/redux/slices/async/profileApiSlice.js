import { apiSlice } from './apiSlice.js';


export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        saveProfile: builder.mutation({
            query: ({ profile, accessToken }) => {
                return {
                    url: "/api/profile/",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: profile,
                    credentials: "include"
                }
            }
        }),

        getProfile: builder.query({
            query: (accessToken) => ({
                url: "/api/profile/",
                method: 'GET',
                headers: {
                    Authorization: `JWT ${accessToken}`,
                }
            }),
            providesTags: ["User Profile"]
        }),

        patchProfile: builder.mutation({
            query: ({ profile, accessToken }) => {
                return {
                    url: "/api/profile/",
                    method: 'PATCH',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: profile,
                    credentials: "include"
                }
            }
        }),

        patchProficiency: builder.mutation({
            query: ({ payload, accessToken }) => {

                return {
                    url: "/api/profile/proficiency",
                    method: 'PATCH',
                    headers: { Authorization: `JWT ${accessToken}` },
                    body: payload,
                    credentials: "include"
                }
            }
        }),
    }),
});

export const
    {
        useSaveProfileMutation,
        useLazyGetProfileQuery,
        usePatchProfileMutation,
        usePatchProficiencyMutation,
    } = profileApiSlice;