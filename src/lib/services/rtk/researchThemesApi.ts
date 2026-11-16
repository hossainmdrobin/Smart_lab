import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const researchThemesApi = createApi({
  reducerPath: "researchThemesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["ResearchThemes"],
  endpoints: (builder) => ({
    getResearchThemes: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/research-themes",
      transformResponse: (response: { data: Array<Record<string, unknown>> }) => response.data,
      providesTags: ["ResearchThemes"],
    }),
    createResearchTheme: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/research-themes",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["ResearchThemes"],
    }),
    updateResearchTheme: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/research-themes/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["ResearchThemes"],
    }),
    deleteResearchTheme: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/research-themes/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["ResearchThemes"],
    }),
  }),
});

export const {
  useGetResearchThemesQuery,
  useCreateResearchThemeMutation,
  useUpdateResearchThemeMutation,
  useDeleteResearchThemeMutation,
} = researchThemesApi;
