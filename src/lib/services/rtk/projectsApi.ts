import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Projects"],
  endpoints: (builder) => ({
    getProjects: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),
    deleteProject: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
