import { baseApi } from "../../utils/apiBaseQuery";


export const quantityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        updateQuantity: builder.mutation({
            query: ({ productId, data }) => ({
                url: `/cart/item/${productId}`,
                method: "PATCH",
                body: data
            }),
            providesTags: ["shipping"],
        }),
    }),
});

// Export hooks
export const {
    useUpdateQuantityMutation,
} = quantityApi;
