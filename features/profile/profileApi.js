import { baseApi } from "../../utils/apiBaseQuery";


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        getProfile: builder.query({
            query: () => ({
                url: "user/profile",
                method: "GET",
            }),
            providesTags: ["Profile"],
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: "user",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Profile"],
        }),

           changePassword : builder.mutation({
            query: (data) => ({
                url: "auth/change-password",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

// Export hooks
export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = authApi;
