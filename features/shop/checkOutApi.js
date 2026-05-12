import { baseApi } from "../../utils/apiBaseQuery";


export const checkOutApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createCheckOut: builder.mutation({
            query: (data) => ({
                url: `/checkout`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["shop"],
        }),

        getMyCheckOut: builder.query({
            query: () => ({
                url: `/checkout/my`,
                method: "GET",
            }),
            providesTags: ["shop"],
        }),

        getSingleCheckOut: builder.query({
            query: (id) => ({
                url: `/checkout/${id}`,
                method: "GET",
            }),
            providesTags: ["shop"],
        }),
    }),
});

// Export hooks
export const {
    useCreateCheckOutMutation,
    useGetMyCheckOutQuery,
    useGetSingleCheckOutQuery
} = checkOutApi;
