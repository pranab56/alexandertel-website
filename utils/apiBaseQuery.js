import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "./BaseURL";

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseURL}/api/v1`,
        prepareHeaders: (headers, { getState }) => {
            // Get token from auth state
            const state = getState();
            const token = state.auth ? state.auth.token : null;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
    tagTypes: ["Profile", "shop", "cart", "favoriteProduct", "shipping"],
});
