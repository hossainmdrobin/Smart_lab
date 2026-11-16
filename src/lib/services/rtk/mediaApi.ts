import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Media"],
  endpoints: (builder) => ({
    getMedia: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/media",
      transformResponse: (response: { data: Array<Record<string, unknown>> }) => response.data,
      providesTags: ["Media"],
    }),
    createMedia: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/media",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Media"],
    }),
    updateMedia: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/media/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Media"],
    }),
    deleteMedia: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Media"],
    }),
  }),
});

export const {
  useGetMediaQuery,
  useCreateMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
