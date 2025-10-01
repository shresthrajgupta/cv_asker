import { apiSlice } from './apiSlice.js';


export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        signup: builder.mutation({
            query: ({ email, password, re_password }) => ({
                url: "/api/auth/users/",
                method: 'POST',
                body: { email, password, re_password }
            })
        }),

        verifyAccount: builder.mutation({
            query: ({ uid, token }) => ({
                url: "/api/auth/users/activation/",
                method: 'POST',
                body: { uid, token }
            })
        }),

        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "/api/auth/jwt/create/",
                method: 'POST',
                body: { email, password }
            })
        }),

        resetPassword: builder.mutation({
            query: (email) => ({
                url: "/api/auth/users/reset_password/",
                method: 'POST',
                body: { email }
            })
        }),

        setNewPassword: builder.mutation({
            query: ({ uid, token, password, rePassword }) => ({
                url: "/api/auth/users/reset_password_confirm/",
                method: 'POST',
                body: { uid, token, new_password: password, re_new_password: rePassword }
            })
        }),

        userAccountInfo: builder.query({
            query: (accessToken) => ({
                url: "/api/auth/users/me/",
                method: 'GET',
                headers: {
                    Authorization: `JWT ${accessToken}`,
                }
            }),
            providesTags: ["User Account"]
        }),

        updateUserAccountInfo: builder.mutation({
            query: ({ name, accessToken }) => ({
                url: "/api/auth/users/me/",
                method: 'PATCH',
                body: { name },
                headers: { authorization: `JWT ${accessToken}` },
                credentials: "include"
            })
        }),

        deleteUserAccount: builder.mutation({
            query: ({ password, accessToken }) => ({
                url: "/api/auth/users/me/",
                method: 'DELETE',
                body: { current_password: password },
                headers: { authorization: `JWT ${accessToken}` },
                credentials: "include"
            })
        }),

        getAccessToken: builder.mutation({
            query: () => ({
                url: "/api/auth/jwt/refresh/",
                method: 'POST',
                credentials: "include"
            })
        }),

        // forgotPassword: builder.mutation({
        //     query: ({ email, password }) => ({
        //         url: "/api/users/forgotpassword",
        //         method: 'POST',
        //         body: { email, password }
        //     })
        // }),

        // homepageGames: builder.query({
        //     query: () => ({
        //         url: "/api/users/homepagegames",
        //         method: 'GET'
        //     }),
        //     providesTags: ["Game"],
        //     keepUnusedDataFor: 10
        // }),

        // addToPlaylist: builder.mutation({
        //     query: ({ gameId }) => ({
        //         url: "/api/users/playlist",
        //         method: 'POST',
        //         body: { gameId }
        //     })
        // }),

        // delFromPlaylist: builder.mutation({
        //     query: ({ gameId }) => ({
        //         url: "/api/users/playlist",
        //         method: 'DELETE',
        //         body: { gameId }
        //     })
        // }),

        // addToCompletedList: builder.mutation({
        //     query: ({ gameId }) => ({
        //         url: "/api/users/completedlist",
        //         method: 'POST',
        //         body: { gameId }
        //     })
        // }),

        // delFromCompletedList: builder.mutation({
        //     query: ({ gameId }) => ({
        //         url: "/api/users/completedlist",
        //         method: 'DELETE',
        //         body: { gameId }
        //     })
        // }),

        // showPlaylist: builder.query({
        //     query: ({ pageNo }) => ({
        //         url: `/api/users/playlist?page=${pageNo}`,
        //         method: 'GET'
        //     }),
        //     providesTags: ["Game"],
        //     keepUnusedDataFor: 10
        // }),

        // showCompletedList: builder.query({
        //     query: ({ pageNo }) => ({
        //         url: `/api/users/completedlist?page=${pageNo}`,
        //         method: 'GET'
        //     }),
        //     providesTags: ["Game"],
        //     keepUnusedDataFor: 10
        // }),

    })
});

export const
    {
        useSignupMutation,
        useVerifyAccountMutation,
        useLoginMutation,
        useResetPasswordMutation,
        useSetNewPasswordMutation,
        useLazyUserAccountInfoQuery,
        useUpdateUserAccountInfoMutation,
        useDeleteUserAccountMutation,
        useGetAccessTokenMutation,
        // useForgotPasswordMutation,
        // useHomepageGamesQuery,
        // useAddToPlaylistMutation,
        // useDelFromPlaylistMutation,
        // useAddToCompletedListMutation,
        // useDelFromCompletedListMutation,
        // useLazyShowPlaylistQuery,
        // useLazyShowCompletedListQuery
    } = usersApiSlice;