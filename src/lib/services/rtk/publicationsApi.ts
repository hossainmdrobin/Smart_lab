import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicationsApi = createApi({
  reducerPath: "publicationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Publications"],
  endpoints: (builder) => ({
    getPublications: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/publications",
      transformResponse: (response: { data: Array<Record<string, unknown>> }) => response.data,
      providesTags: ["Publications"],
    }),
    createPublication: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/publications",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Publications"],
    }),
    updatePublication: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/publications/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Publications"],
    }),
    deletePublication: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/publications/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Publications"],
    }),
  }),
});

export const {
  useGetPublicationsQuery,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
} = publicationsApi;
