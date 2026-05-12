import { baseApi } from "../../utils/apiBaseQuery";


export const overviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        getOverviewStats: builder.query({
            query: () => ({
                url: "/overview/analytics/users",
                method: "GET",
            }),
            providesTags: ["overview"],
        }),
    }),
});

// Export hooks
export const {
    useGetOverviewStatsQuery,
} = overviewApi;
