import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["News"],
  endpoints: (builder) => ({
    getNews: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/news",
      providesTags: ["News"],
    }),
    createNews: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/news",
        method: "POST",
        body,
      }),
      invalidatesTags: ["News"],
    }),
    updateNews: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["News"],
    }),
    deleteNews: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
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
