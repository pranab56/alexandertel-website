import { baseApi } from "../../utils/apiBaseQuery";


export const repairApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllRepair: builder.query({
            query: () => ({
                url: `/repair/my`,
                method: "GET",
            }),
            providesTags: ["repair"],
        }),

        createRepair: builder.mutation({
            query: ({ data }) => ({
                url: `/repair`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["repair"],
        }),
        getAllServices: builder.query({
            query: () => ({
                url: `/service`,
                method: "GET",
            }),
            providesTags: ["repair"],
        }),

        getAllMyProduct: builder.query({
            query: () => ({
                url: `/billing/my-product`,
                method: "GET",
            }),
            providesTags: ["repair"],
        }),
    }),
});

// Export hooks
export const {
    useCreateRepairMutation,
    useGetAllServicesQuery,
    useGetAllMyProductQuery,
    useGetAllRepairQuery,
} = repairApi;
