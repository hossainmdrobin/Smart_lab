import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getSettings: builder.query<{ settings: Record<string, unknown>; raw: Array<Record<string, unknown>> }, void>({
      query: () => "/settings",
      transformResponse: (response: { data: { settings: Record<string, unknown>; raw: Array<Record<string, unknown>> } }) => response.data,
      providesTags: ["Settings"],
    }),
    updateSetting: builder.mutation<Record<string, unknown>, { key: string; value: unknown; type: "string" | "boolean" | "number" }>({
      query: (body) => ({
        url: "/settings",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingMutation } = settingsApi;
