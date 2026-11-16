import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicationsApi = createApi({
  reducerPath: "publicationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Publications"],
  endpoints: (builder) => ({
    getPublications: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/publications",
      providesTags: ["Publications"],
    }),
    createPublication: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/publications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Publications"],
    }),
    updatePublication: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/publications/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Publications"],
    }),
    deletePublication: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/publications/${id}`,
        method: "DELETE",
      }),
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
