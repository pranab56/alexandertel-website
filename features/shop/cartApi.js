import { baseApi } from "../../utils/apiBaseQuery";


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        AddToCard: builder.mutation({
            query: (data) => ({
                url: "cart/add",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["cart"],
        }),

        myAllProduct: builder.query({
            query: () => ({
                url: "/cart/my",
                method: "GET",
            }),
            providesTags: ["cart"],
        }),

        updateQuantity: builder.mutation({
            query: ({ id, data }) => ({
                url: `/cart/item/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["cart"],
        }),

        deleteCartItem: builder.mutation({
            query: ({ id }) => ({
                url: `/cart/item/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["cart"],
        }),
    }),
});

// Export hooks
export const {
    useAddToCardMutation,
    useMyAllProductQuery,
    useUpdateQuantityMutation,
    useDeleteCartItemMutation
} = authApi;
