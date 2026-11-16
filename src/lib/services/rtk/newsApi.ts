import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["News"],
  endpoints: (builder) => ({
    getNews: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/news",
      transformResponse: (response: { data: Array<Record<string, unknown>> }) => response.data,
      providesTags: ["News"],
    }),
    createNews: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/news",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["News"],
    }),
    updateNews: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["News"],
    }),
    deleteNews: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["News"],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
