import { apiSlice } from './apiSlice.js';


export const cvApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadPDF: builder.mutation({
            query: ({ file, custom_fields, accessToken }) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("custom_fields", JSON.stringify(custom_fields));

                return {
                    url: "/api/upload/",
                    method: 'POST',
                    headers: { authorization: `JWT ${accessToken}` },
                    body: formData,
                    credentials: "include"
                }
            }
        }),
    })
});

export const
    {
        useUploadPDFMutation,
    } = cvApiSlice;