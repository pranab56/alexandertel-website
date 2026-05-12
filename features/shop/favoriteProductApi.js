import { baseApi } from "../../utils/apiBaseQuery";


export const favoriteProductApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        addFavoriteProduct: builder.mutation({
            query: (productId) => ({
                url: `/favorite/${productId}`,
                method: "POST",
            }),
            invalidatesTags: ["favoriteProduct"],
        }),

        myAllFavoriteProduct: builder.query({
            query: () => ({
                url: "/favorite/my",
                method: "GET",
            }),
            providesTags: ["favoriteProduct"],
        }),

        deleteFavoriteProduct: builder.mutation({
            query: (id) => ({
                url: `/favorite/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["favoriteProduct"],
        }),


    }),
});

// Export hooks
export const {
    useAddFavoriteProductMutation,
    useMyAllFavoriteProductQuery,
    useDeleteFavoriteProductMutation
} = favoriteProductApi;
