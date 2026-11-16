import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const opportunitiesApi = createApi({
  reducerPath: "opportunitiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Opportunities"],
  endpoints: (builder) => ({
    getOpportunities: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/opportunities",
      transformResponse: (response: { data: Array<Record<string, unknown>> }) => response.data,
      providesTags: ["Opportunities"],
    }),
    createOpportunity: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/opportunities",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Opportunities"],
    }),
    updateOpportunity: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/opportunities/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Opportunities"],
    }),
    deleteOpportunity: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/opportunities/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Opportunities"],
    }),
  }),
});

export const {
  useGetOpportunitiesQuery,
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
} = opportunitiesApi;
