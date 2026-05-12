import { baseApi } from "../../utils/apiBaseQuery";


export const shopApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        getAllProduct: builder.query({
            query: ({ searchTerm, deviceType, minPrice, maxPrice, categories, sortBy, sortOrder }) => {
                const params = new URLSearchParams();

                if (searchTerm) params.append("searchTerm", searchTerm);
                if (deviceType) params.append("deviceType", deviceType);
                if (minPrice) params.append("minPrice", minPrice);
                if (maxPrice) params.append("maxPrice", maxPrice);
                if (categories) params.append("categories", categories);
                if (sortBy) params.append("sortBy", sortBy);
                if (sortOrder) params.append("sortOrder", sortOrder);

                return {
                    url: `/product?${params.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["shop"],
        }),

        getSingleProduct: builder.query({
            query: (id) => ({
                url: `/product/${id}`,
                method: "GET",
            }),
            providesTags: ["shop"],
        }),

        getRelatedProduct: builder.query({
            query: (id) => ({
                url: `/product/${id}/related`,
                method: "GET",
            }),
            providesTags: ["shop"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllProductQuery,
    useGetSingleProductQuery,
    useGetRelatedProductQuery
} = shopApi;
