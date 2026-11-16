import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/users",
      transformResponse: (response: { data: Array<Record<string, unknown>> }) => response.data,
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
