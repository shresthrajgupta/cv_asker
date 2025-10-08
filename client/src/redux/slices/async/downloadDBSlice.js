import { apiSlice } from './apiSlice.js';


export const downloadDBSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        downloadDB: builder.query({
            query: (accessToken) => {
                return {
                    url: "/api/admin/download_db/",
                    method: 'GET',
                    headers: { authorization: `JWT ${accessToken}` },
                    credentials: "include",
                    responseHandler: async (response) => {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'db.sqlite3';
                        a.click();
                        window.URL.revokeObjectURL(url);
                        return { success: true };
                    },
                }
            }
        })
    })
});

export const
    {
        useLazyDownloadDBQuery
    } = downloadDBSlice;