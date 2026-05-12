import { baseApi } from "../../utils/apiBaseQuery";


export const shippingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        getShipping: builder.query({
            query: () => ({
                url: "shipping",
                method: "GET",
            }),
            providesTags: ["shipping"],
        }),
    }),
});

// Export hooks
export const {
    useGetShippingQuery,
} = shippingApi;
