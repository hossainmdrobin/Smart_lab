import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const peopleApi = createApi({
  reducerPath: "peopleApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["People"],
  endpoints: (builder) => ({
    getPeople: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/people",
      providesTags: ["People"],
    }),
    createPerson: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/people",
        method: "POST",
        body,
      }),
      invalidatesTags: ["People"],
    }),
    updatePerson: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/people/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["People"],
    }),
    deletePerson: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/people/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["People"],
    }),
  }),
});

export const {
  useGetPeopleQuery,
  useCreatePersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,
} = peopleApi;
