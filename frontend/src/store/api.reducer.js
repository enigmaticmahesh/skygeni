import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_BASE_URL = 'http://localhost:7002/api/v1'

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
});

const apiReducer = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOPtions) => {
    let result = await baseQuery(args, api, extraOPtions);
    return result;
  },
  endpoints: (builder) => ({
    getTeams: builder.query({
        query: () => '/data/team',
    }),
    getAccIndustries: builder.query({
        query: () => '/data/acc-ind',
    }),
  }),
});

export const { useGetTeamsQuery, useGetAccIndustriesQuery } = apiReducer;
export default apiReducer;